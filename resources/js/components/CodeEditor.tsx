import React from 'react';
import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror';
import { EditorView } from "@codemirror/view";
import { php } from '@codemirror/lang-php';
import { githubDark } from '@uiw/codemirror-theme-github';

interface EditorProps {
    value: string;
    state: any;
    stateFields: any;
    onChange: (value: string, viewUpdate: ViewUpdate) => void;
    onKeyDownCapture: (event: React.KeyboardEvent) => void;
}

const CodeEditor: React.FC<EditorProps> = ({ value, state, stateFields, onChange, onKeyDownCapture }) => {
    return (
        <CodeMirror
            height="100%"
            theme={githubDark}
            extensions={[
                php({
                    plain: true,
                }),
                EditorView.lineWrapping,
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
            value={value}
            initialState={
                state
                    ? {
                        json: JSON.parse(state || ""),
                        fields: stateFields,
                    }
                    : undefined
            }
            onChange={onChange}
            onKeyDownCapture={onKeyDownCapture}
        />
    );
};

export default CodeEditor;
