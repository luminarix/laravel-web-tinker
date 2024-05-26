import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import CodeIcon from '@/components/icons/CodeIcon';
import PlayIcon from '@/components/icons/PlayIcon';

interface HeaderProps {
    loading: boolean;
    onRun: () => void;
}

const Header: React.FC<HeaderProps> = ({ loading, onRun }) => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [startTime, setStartTime] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (loading) {
            setStartTime(Date.now());
            interval = setInterval(() => {
                setElapsedTime(Date.now() - startTime);
            }, 100);
        } else {
            setElapsedTime(0);
            setStartTime(0);
        }

        return () => clearInterval(interval);
    }, [loading, startTime]);

    return (
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
                ) : (
                    <Button
                        className="h-8 w-8 hover:bg-gray-800 text-gray-400 hover:text-gray-50"
                        size="icon"
                        variant="ghost"
                        onClick={onRun}
                    >
                        <PlayIcon className="h-4 w-4" />
                        <span className="sr-only">Run</span>
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Header;
