import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CodeIcon from '@/components/icons/CodeIcon';
import PlayIcon from '@/components/icons/PlayIcon';
import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror';
import { php } from '@codemirror/lang-php';
import { githubDark } from '@uiw/codemirror-theme-github';
import { historyField } from '@codemirror/commands';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import parse from 'html-react-parser';
import TrashIcon from './components/icons/TrashIcon';
import Splitter, { SplitDirection } from '@devbookhq/splitter';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const stateFields = { history: historyField };
const editorStateKey = "editorState";
const editorValueKey = "editorValue";
const editorTabNameKey = "editorTabName";
const selectedTabKey = "selectedTab";

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
    const [editableTab, setEditableTab] = useState<number | null>(null);
    const [tempTabName, setTempTabName] = useState("");
    const [loading, setLoading] = useState(false);
    const [startTime, setStartTime] = useState(0);

    const [elapsedTime, setElapsedTime] = useState(0);
    const skeletonWidths = useRef(generateRandomArray());

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (loading) {
            interval = setInterval(() => {
                setElapsedTime(Date.now() - startTime);
            }, 100);
        }

        return () => clearInterval(interval);
    }, [startTime]);

    useEffect(() => {
        const nextState = valueInStorage(editorStateKey, activeTab);

        setState(() => nextState || "");
    }, [activeTab]);

    if (tabs.length === 0) {
        addTab();
    }

    function handleDoubleClick(tabIndex: number) {
        setEditableTab(tabIndex);
        setTempTabName(
            valueInStorage(editorTabNameKey, tabIndex) === ""
                ? `${tabIndex}`
                : valueInStorage(editorTabNameKey, tabIndex),
        );
    }

    function handleNameChange(event: React.KeyboardEvent) {
        if (event.key === "Enter") {
            setEditableTab(null);

            valueInStorage(editorTabNameKey, editableTab!, tempTabName);
        }

        if (event.key === "Escape") {
            setEditableTab(null);
        }
    }

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
            sendCurrentCode();

            return false;
        }
    }

    function sendCurrentCode() {
        const code = valueInStorage(editorValueKey, activeTab);

        if (code === "") {
            return;
        }

        skeletonWidths.current = generateRandomArray();
        setLoading(true);
        setStartTime(Date.now());

        axios
            .post(path, { code })
            .then((result) => {
                setOutput(() => result.data);
            })
            .catch((error) => {
                console.error("Error executing code:", error);
            })
            .finally(() => {
                setLoading(false);
                setElapsedTime(0);
                setStartTime(0);
            });
    }

    function handleChange(value: string, viewUpdate: ViewUpdate) {
        valueInStorage(editorValueKey, activeTab, value);

        const state = viewUpdate.state.toJSON(stateFields);
        valueInStorage(editorStateKey, activeTab, JSON.stringify(state));
        setState(JSON.stringify(state));
    }

    function addTab() {
        const newTabIndex = (tabs[tabs.length - 1] ?? 0) + 1;
        setTabs((prevTabs) => [...prevTabs, newTabIndex]);
        valueInStorage(editorValueKey, newTabIndex, "");
        selectTab(newTabIndex);
    }

    function selectTab(tabIndex: number) {
        setActiveTab(() => tabIndex);
        localStorage.setItem(selectedTabKey, tabIndex.toString());
    }

    function deleteTab(tabIndex: number) {
        const newTabs = tabs.filter((tab) => tab !== tabIndex);
        setTabs(() => newTabs);
        valueInStorage(editorValueKey, tabIndex, null);
        valueInStorage(editorStateKey, tabIndex, null);

        if (activeTab === tabIndex) {
            selectTab(newTabs[newTabs.length - 1]);
        }
    }

    function generateRandomArray() {
        const length = Math.floor(Math.random() * (7 - 3 + 1) + 3);

        return Array.from({ length }, () => Math.random());
    }

    return (
        <Splitter
            minHeights={[0, 0]}
            initialSizes={[50, 50]}
            direction={SplitDirection.Horizontal}
            gutterClassName={"bg-gray-800 min-h-screen"}
        >
            <div className="h-screen flex flex-col border-r bg-gray-900 border-gray-800">
                <div className="flex h-14 items-center justify-between border-b px-4 border-gray-800">
                    <div className="flex items-center gap-2">
                        <CodeIcon className="h-5 w-5 mr-2 text-gray-400" />
                        <span className="text-lg font-medium text-gray-50">
                            Laravel Web Tinker
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {loading ? (
                            <span className="text-xs text-gray-400 font-mono">
                                {(elapsedTime / 1000).toFixed(1)}s
                            </span>
                        ): (
                            <Button
                                className="h-8 w-8 hover:bg-gray-800"
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                    sendCurrentCode();
                                }}
                            >
                                <PlayIcon className="h-4 w-4 text-gray-400 hover:text-gray-50" />
                                <span className="sr-only">Run</span>
                            </Button>
                        )}
                    </div>
                </div>
                <div className="border-b border-gray-800 flex justify-between">
                    <div>
                        {tabs.map((tab) =>
                            editableTab === tab ? (
                                <input
                                    type="text"
                                    value={tempTabName}
                                    onChange={(e) =>
                                        setTempTabName(e.target.value)
                                    }
                                    onKeyDownCapture={handleNameChange}
                                    onBlur={() => setEditableTab(null)}
                                    autoFocus
                                    className="py-2 px-4 text-white bg-gray-700"
                                />
                            ) : (
                                <button
                                    key={tab}
                                    className={`py-2 px-4 hover:bg-gray-800 ${tab === activeTab ? "text-white bg-gray-700" : "text-gray-400"}`}
                                    onClick={() => selectTab(tab)}
                                    onDoubleClick={() => handleDoubleClick(tab)}
                                >
                                    {valueInStorage(editorTabNameKey, tab) ||
                                        tab}
                                </button>
                            ),
                        )}
                        <button
                            className="py-2 px-4 text-gray-400"
                            onClick={() => addTab()}
                        >
                            +
                        </button>
                    </div>
                    {tabs.length > 1 && (
                        <button
                            key="delete"
                            className={`py-2 px-4 hover:bg-gray-800 text-gray-400`}
                            onClick={() => deleteTab(activeTab)}
                        >
                            <TrashIcon className="h-3 w-3 text-red-800 hover:text-red-400" />
                        </button>
                    )}
                </div>
                <div className="flex-1 overflow-auto text-gray-400">
                    <CodeMirror
                        key={activeTab}
                        onKeyDownCapture={(event) => handleKeyDown(event)}
                        height="100%"
                        theme={githubDark}
                        extensions={[
                            php({
                                plain: true,
                            }),
                        ]}
                        autoFocus={true}
                        basicSetup={{
                            allowMultipleSelections: true,
                            tabSize: 4,
                            bracketMatching: true,
                            autocompletion: true,
                            rectangularSelection: true,
                            highlightActiveLine: true,
                            syntaxHighlighting: true,
                        }}
                        className="h-full"
                        value={valueInStorage(editorValueKey, activeTab)}
                        initialState={
                            state
                                ? {
                                      json: JSON.parse(state || ""),
                                      fields: stateFields,
                                  }
                                : undefined
                        }
                        onChange={(value, viewUpdate) =>
                            handleChange(value, viewUpdate)
                        }
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
