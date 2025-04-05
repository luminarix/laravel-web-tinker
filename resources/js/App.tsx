import Editor from './Editor';

interface AppProps {
    path: string;
    environment: string;
}

function App({ path, environment }: AppProps) {
    return (
        <>
            <Editor path={path} environment={environment}/>
        </>
    );
}

export default App;