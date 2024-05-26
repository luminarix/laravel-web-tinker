import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import TrashIcon from '@/components/icons/TrashIcon';

interface TabProps {
    tabs: number[];
    tabNames: string[];
    activeTab: number;
    onAddTab: () => void;
    onSelectTab: (tabIndex: number) => void;
    onDeleteTab: (tabIndex: number) => void;
    onRenameTab: (tabIndex: number, name: string) => void;
}

const Tab: React.FC<TabProps> = ({
                                     tabs,
                                     tabNames,
                                     activeTab,
                                     onAddTab,
                                     onSelectTab,
                                     onDeleteTab,
                                     onRenameTab,
                                 }) => {
    const [ editableTab, setEditableTab ] = useState<number | null>(null);
    const [ tempTabName, setTempTabName ] = useState('');

    function handleDoubleClick(tabIndex: number) {
        setEditableTab(tabIndex);
        setTempTabName((tabNames[tabIndex] ?? tabIndex).toString());
    }

    function handleNameChange(event: React.KeyboardEvent) {
        if (event.key === 'Enter') {
            tabNames[editableTab!] = tempTabName;
            setEditableTab(null);
            onRenameTab(editableTab!, tempTabName);
        } else if (event.key === 'Escape') {
            setEditableTab(null);
        }
    }

    return (
        <div className="border-b border-gray-800 flex justify-between">
            <div>
                {tabs.map((tab: number) =>
                    editableTab === tab ? (
                        <input
                            key={tab}
                            type="text"
                            value={tempTabName}
                            onChange={(e) => setTempTabName(e.target.value)}
                            onKeyDownCapture={handleNameChange}
                            onBlur={() => setEditableTab(null)}
                            autoFocus
                            className="py-2 px-4 text-white bg-gray-700"
                        />
                    ) : (
                        <Button
                            key={tab}
                            className={`ml-1 py-2 px-4 hover:bg-gray-800 ${tab === activeTab ? 'text-white bg-gray-700' : 'text-gray-400'}`}
                            onClick={() => onSelectTab(tab)}
                            onDoubleClick={() => handleDoubleClick(tab)}
                        >
                            {tabNames[tab] || tab}
                        </Button>
                    ),
                )}
                <Button
                    className="ml-1 py-2 px-4 hover:bg-gray-800 text-gray-400"
                    onClick={onAddTab}
                >
                    +
                </Button>
            </div>
            {tabs.length > 1 && (
                <Button
                    key="delete"
                    className={`ml-1 py-2 px-4 hover:bg-gray-800 text-red-800 hover:text-red-400`}
                    onClick={() => onDeleteTab(activeTab)}
                >
                    <TrashIcon className="h-3 w-3"/>
                </Button>
            )}
        </div>
    );
};

export default Tab;
