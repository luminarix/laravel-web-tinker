import { Card, CardContent } from '@/components/ui/card';
import { ViewUpdate } from '@uiw/react-codemirror';
import { historyField } from '@codemirror/commands';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import parse from 'html-react-parser';
import Splitter, { SplitDirection } from '@devbookhq/splitter';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { generateRandomArray } from './lib/utils';
import Header from './components/Header';
import TabList from './components/TabList';
import CodeEditor from './components/CodeEditor';

const stateFields = { history: historyField };
const editorStateKey = "editorState";
const editorValueKey = "editorValue";
const editorTabNameKey = "editorTabName";
const selectedTabKey = "selectedTab";
const splitterStateKey = "splitterState";

export default function Editor({ path }: { path: string }) {
    const [output, setOutput] = useState("");
    const [tabs, setTabs] = useState(
        Object.keys(
            JSON.parse(localStorage.getItem(editorValueKey) || "{}"),
        ).map(Number),
    );
    const [activeTab, setActiveTab] = useState(
        parseInt(localStorage.getItem(selectedTabKey) || "1"),
    );
    const [state, setState] = useState(
        valueInStorage(editorStateKey, activeTab),
    );
    const [loading, setLoading] = useState(false);
    const [startTime, setStartTime] = useState(0);

    const [_, setElapsedTime] = useState(0);
    const skeletonWidths = useRef(generateRandomArray());

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (loading) {
            interval = setInterval(() => {
                setElapsedTime(Date.now() - startTime);
            }, 100);
        }

        return () => clearInterval(interval);
    }, [loading, startTime]);

    useEffect(() => {
        const nextState = valueInStorage(editorStateKey, activeTab);

        setState(nextState || "");
    }, [activeTab]);

    useEffect(() => {
        if (tabs.length === 0) {
            addTab();
        }
    }, [tabs]);

    function valueInStorage(
        storageKey: string,
        tabIndex: number,
        value: string | null | undefined = undefined,
    ) {
        const storedValueString = localStorage.getItem(storageKey) || "{}";
        let storedValue;

        try {
            storedValue = JSON.parse(storedValueString);
        } catch (error) {
            console.error("Error parsing JSON from localStorage:", error);
            storedValue = {};
        }

        if (value === undefined) {
            return storedValue[tabIndex] || "";
        }

        if (value === null) {
            delete storedValue[tabIndex];
        } else {
            storedValue[tabIndex] = value;
        }

        try {
            localStorage.setItem(storageKey, JSON.stringify(storedValue));
        } catch (error) {
            console.error("Error stringifying JSON for localStorage:", error);
        }
    }

    function handleKeyDown(event: React.KeyboardEvent) {
        if (event.code === "Enter" && (event.ctrlKey || event.metaKey)) {
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
            console.error("Error executing code:", error);
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
        setTabs((prevTabs: number[]) => [...prevTabs, newTabIndex]);
        valueInStorage(editorValueKey, newTabIndex, "");
        selectTab(newTabIndex);
    }

    function selectTab(tabIndex: number) {
        setActiveTab(() => tabIndex);
        localStorage.setItem(selectedTabKey, tabIndex.toString());
    }

    function deleteTab(tabIndex: number) {
        const newTabs = tabs.filter((tab: number) => tab !== tabIndex);
        setTabs(newTabs);
        valueInStorage(editorValueKey, tabIndex, null);
        valueInStorage(editorStateKey, tabIndex, null);

        if (activeTab === tabIndex && newTabs.length > 0) {
            selectTab(newTabs[newTabs.length - 1]);
        }
    }

    return (
        <Splitter
            minHeights={[0, 0]}
            initialSizes={(localStorage.getItem(splitterStateKey) || "50,50").split(",").map(Number)}
            minWidths={[500,500]}
            direction={SplitDirection.Horizontal}
            gutterClassName={"bg-gray-800 min-h-screen"}
            onResizeFinished={(_, newSizes) => localStorage.setItem(splitterStateKey, newSizes.join(","))}
        >
            <div className="h-screen flex flex-col border-r bg-gray-900 border-gray-800">
                <Header loading={loading} onRun={sendCurrentCode} />
                <TabList
                    tabs={tabs}
                    tabNames={JSON.parse(localStorage.getItem(editorTabNameKey) || "{}")}
                    activeTab={activeTab}
                    onAddTab={addTab}
                    onSelectTab={selectTab}
                    onDeleteTab={deleteTab}
                    onRenameTab={(tabIndex, tabName) => valueInStorage(editorTabNameKey, tabIndex, tabName)}
                />
                <div className="flex-1 overflow-auto text-gray-400">
                    <CodeEditor
                        value={valueInStorage(editorValueKey, activeTab)}
                        state={state}
                        stateFields={stateFields}
                        onChange={handleChange}
                        onKeyDownCapture={handleKeyDown}
                    />
                </div>
            </div>
            <div className="h-screen flex flex-col">
                <div className="flex h-14 px-5 items-center justify-between bg-gray-900 border-gray-800">
                    <span className="text-sm font-medium text-gray-50">
                        Output
                    </span>
                </div>
                <div className="flex-1 overflow-auto bg-slate-700">
                    <Card className="h-full w-full bg-slate-700 text-gray-200 border-none">
                        <CardContent className="px-5 py-3 font-mono text-sm">
                            <pre>
                                <code>
                                    {loading ? (
                                        <>
                                            {skeletonWidths.current.map((width, index) => (
                                                <Skeleton
                                                    key={index}
                                                    baseColor={"#111827"}
                                                    highlightColor={"#28395c"}
                                                    enableAnimation={true}
                                                    width={`${Math.floor(width * 100)}%`}
                                                />
                                            ))}
                                        </>
                                    ) : (
                                        (output && parse(output)) || (
                                            <span className="text-gray-400">
                                                Output will appear here...
                                                <div className="my-6"></div>
                                                You can press{" "}
                                                <kbd>Ctrl + Enter</kbd> or{" "}
                                                <kbd>Cmd + Enter</kbd> to run
                                                the code.
                                            </span>
                                        )
                                    )}
                                </code>
                            </pre>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Splitter>
    );
}
