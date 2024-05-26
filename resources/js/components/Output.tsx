import React from 'react';
import parse from 'html-react-parser';
import Skeleton from 'react-loading-skeleton';
import { Card, CardContent } from '@/components/ui/card';

interface OutputProps {
    loading: boolean;
    output: string;
    skeletonWidths: number[];
}

const Output: React.FC<OutputProps> = ({ loading, output, skeletonWidths }) => {
    return (
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
                                        {skeletonWidths.map((width, index) => (
                                            <Skeleton
                                                key={index}
                                                baseColor={'#111827'}
                                                highlightColor={'#28395c'}
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
                                            You can press{' '}
                                            <kbd>Ctrl + Enter</kbd> or{' '}
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
    );
};

export default Output;
