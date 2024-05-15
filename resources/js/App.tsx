import Editor from "./Editor";

function App({ path }: { path: string }) {
    return (
        <>
            <Editor path={path} />
        </>
    );
}

export default App;
