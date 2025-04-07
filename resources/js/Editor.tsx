import { ViewUpdate } from '@uiw/react-codemirror';
import { historyField } from '@codemirror/commands';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Splitter, { SplitDirection } from '@devbookhq/splitter';
import 'react-loading-skeleton/dist/skeleton.css';
import { generateRandomArray, valueInStorage, valueInStorageAsNumber, valueInStorageAsNumbers } from './lib/utils';
import Header from './components/Header';
import TabList from './components/TabList';
import CodeEditor from './components/CodeEditor';
import Output from './components/Output';

const stateFields = { history: historyField };
const editorStateKey = 'editorState';
const editorValueKey = 'editorValue';
const editorTabNameKey = 'editorTabName';
const selectedTabKey = 'selectedTab';
const splitterStateKey = 'splitterState';

interface EditorProps {
    path: string;
    environment: string;
}

export default function Editor({ path, environment }: EditorProps) {
    const [ output, setOutput ] = useState('');
    const [ tabs, setTabs ] = useState(valueInStorageAsNumbers(editorValueKey));
    const [ activeTab, setActiveTab ] = useState(valueInStorageAsNumber(selectedTabKey));
    const [ state, setState ] = useState(valueInStorage(editorStateKey, activeTab));
    const [ loading, setLoading ] = useState(false);
    const [ startTime, setStartTime ] = useState(0);
    const [ _, setElapsedTime ] = useState(0);
    const skeletonWidths = useRef(generateRandomArray());

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (loading) {
            interval = setInterval(() => {
                setElapsedTime(Date.now() - startTime);
            }, 100);
        }

        return () => clearInterval(interval);
    }, [ loading, startTime ]);

    useEffect(() => {
        const nextState = valueInStorage(editorStateKey, activeTab);

        setState(nextState || '');
    }, [ activeTab ]);

    useEffect(() => {
        if (tabs.length === 0) {
            addTab();
        }
    }, [ tabs ]);

    function handleKeyDown(event: React.KeyboardEvent) {
        if (event.code === 'Enter' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            event.stopPropagation();
            void sendCurrentCode();

            return false;
        }
    }

    async function sendCurrentCode() {
        const code = valueInStorage(editorValueKey, activeTab);

        if (!code) {
            return;
        }

        skeletonWidths.current = generateRandomArray();
        setLoading(true);
        setStartTime(Date.now());

        try {
            const result = await axios.post(path, { code });
            setOutput(result.data);
        } catch (error) {
            setOutput(`Error executing code: ${(error as Error).message} - Please make sure you're logged in.`);
            console.error('Error executing code:', error);
        } finally {
            setLoading(false);
            setElapsedTime(0);
            setStartTime(0);
        }
    }

    function handleChange(value: string, viewUpdate: ViewUpdate) {
        valueInStorage(editorValueKey, activeTab, value);

        const state = viewUpdate.state.toJSON(stateFields);
        valueInStorage(editorStateKey, activeTab, JSON.stringify(state));
        setState(JSON.stringify(state));
    }

    function addTab() {
        const newTabIndex = (tabs[tabs.length - 1] ?? 0) + 1;
        setTabs((prevTabs: number[]) => [ ...prevTabs, newTabIndex ]);
        valueInStorage(editorValueKey, newTabIndex, '');
        selectTab(newTabIndex);
        setOutput('');
    }

    function selectTab(tabIndex: number) {
        setActiveTab(() => tabIndex);
        localStorage.setItem(selectedTabKey, tabIndex.toString());
        setOutput('');
    }

    function deleteTab(tabIndex: number) {
        const newTabs = tabs.filter((tab: number) => tab !== tabIndex);
        setTabs(newTabs);
        valueInStorage(editorValueKey, tabIndex, null);
        valueInStorage(editorStateKey, tabIndex, null);

        if (activeTab === tabIndex && newTabs.length > 0) {
            selectTab(newTabs[newTabs.length - 1]);
        }

        setOutput('');
    }

    return (
        <Splitter
            minHeights={[ 0, 0 ]}
            initialSizes={(localStorage.getItem(splitterStateKey) || '50,50').split(',').map(Number)}
            minWidths={[ 500, 500 ]}
            direction={SplitDirection.Horizontal}
            gutterClassName={'bg-gray-800 min-h-screen'}
            onResizeFinished={(_, newSizes) => localStorage.setItem(splitterStateKey, newSizes.join(','))}
        >
            <div className="h-screen flex flex-col border-r bg-gray-900 border-gray-800">
                <Header loading={loading} onRun={sendCurrentCode} environment={environment}/>
                <TabList
                    tabs={tabs}
                    tabNames={JSON.parse(localStorage.getItem(editorTabNameKey) || '{}')}
                    activeTab={activeTab}
                    onAddTab={addTab}
                    onSelectTab={selectTab}
                    onDeleteTab={deleteTab}
                    onRenameTab={(tabIndex, tabName) => valueInStorage(editorTabNameKey, tabIndex, tabName)}
                />
                <div className="flex-1 overflow-auto text-gray-400">
                    <CodeEditor
                        key={activeTab}
                        value={valueInStorage(editorValueKey, activeTab)}
                        state={state}
                        stateFields={stateFields}
                        onChange={handleChange}
                        onKeyDownCapture={handleKeyDown}
                    />
                </div>
            </div>
            <Output
                loading={loading}
                output={output}
                skeletonWidths={skeletonWidths.current}
            />
        </Splitter>
    );
}
