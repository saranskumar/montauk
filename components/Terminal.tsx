'use client';

import { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

interface TerminalProps {
    isUpsideDownMode: boolean;
    onCommand?: (command: string) => string | void;
    embedded?: boolean;
}

interface HistoryEntry {
    command: string;
    output?: string;
    timestamp: Date;
}

export default function Terminal({ isUpsideDownMode, onCommand, embedded = false }: TerminalProps) {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<HistoryEntry[]>([
        { command: 'SYSTEM INITIALIZED', output: 'HAWKINS COMMAND TERMINAL v1.0', timestamp: new Date() }
    ]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const historyRef = useRef<HTMLDivElement>(null);

    // Auto-scroll history to bottom
    useEffect(() => {
        if (historyRef.current) {
            historyRef.current.scrollTop = historyRef.current.scrollHeight;
        }
    }, [history]);

    const executeCommand = (cmd: string) => {
        const trimmed = cmd.trim().toUpperCase();
        if (!trimmed) return;

        let output = '';

        // Built-in commands
        switch (trimmed) {
            case 'HELP':
                output = 'COMMANDS: /INCIDENT (REPORT), /DOOM (NEUTRALIZE ALL), /STAT (METRICS), /HELP';
                break;
            case 'CLEAR':
                setHistory([]);
                setInput('');
                return;
            case 'STATUS':
                output = `MODE: ${isUpsideDownMode ? 'UPSIDE DOWN' : 'NORMAL'} | STATUS: OPERATIONAL`;
                break;
            default:
                // Pass to parent handler
                if (onCommand) {
                    const response = onCommand(trimmed);
                    if (typeof response === 'string') {
                        output = response;
                    } else {
                        output = `COMMAND EXECUTED: ${trimmed}`;
                    }
                } else {
                    output = `UNKNOWN COMMAND: ${trimmed}`;
                }
        }

        setHistory(prev => [...prev, { command: trimmed, output, timestamp: new Date() }]);
        setInput('');
        setHistoryIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            executeCommand(input);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const commands = history.filter(h => h.command !== 'SYSTEM INITIALIZED').map(h => h.command);
            if (commands.length > 0) {
                const newIndex = historyIndex < commands.length - 1 ? historyIndex + 1 : historyIndex;
                setHistoryIndex(newIndex);
                setInput(commands[commands.length - 1 - newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const commands = history.filter(h => h.command !== 'SYSTEM INITIALIZED').map(h => h.command);
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(commands[commands.length - 1 - newIndex]);
            } else {
                setHistoryIndex(-1);
                setInput('');
            }
        }
    };

    return (
        <div
            onClick={() => inputRef.current?.focus()}
            className={`${embedded ? 'h-full w-full flex flex-col cursor-text' : 'fixed bottom-0 left-0 right-0 z-40 border-t-2 backdrop-blur-sm'} transition-colors duration-500 ${isUpsideDownMode
                ? `${embedded ? '' : 'border-upside-down-border bg-upside-down-bg/95'}`
                : `${embedded ? '' : 'border-hawkins-border bg-hawkins-bg/95'}`
                }`}>
            <div className={`max-w-7xl mx-auto px-4 py-3 ${embedded ? 'flex-1 flex flex-col w-full' : ''}`}>
                {/* Terminal Header */}
                <div className="flex items-center gap-2 mb-2">
                    <TerminalIcon className={`w-4 h-4 ${isUpsideDownMode ? 'text-upside-down-accent' : 'text-hawkins-accent'}`} />
                    <span className={`text-xs font-mono uppercase tracking-wider ${isUpsideDownMode ? 'text-upside-down-accent' : 'text-hawkins-accent'
                        }`}>
                        COMMAND TERMINAL
                    </span>
                </div>

                {/* History Display */}
                <div
                    ref={historyRef}
                    className={`${embedded ? 'flex-1 min-h-0' : 'h-24'} overflow-y-auto mb-2 font-mono text-xs space-y-1 scrollbar-thin`}
                >
                    {history.map((entry, i) => (
                        <div key={i} className="opacity-70">
                            <div className={isUpsideDownMode ? 'text-upside-down-glow' : 'text-hawkins-text-primary'}>
                                {'>'} {entry.command}
                            </div>
                            {entry.output && (
                                <div className={`ml-4 mb-2 whitespace-pre-wrap ${isUpsideDownMode ? 'text-upside-down-text' : 'text-hawkins-text-dim'}`}>
                                    {entry.output}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Input Line */}
                <div className="flex items-center gap-2">
                    <span className={`font-mono text-sm ${isUpsideDownMode ? 'text-upside-down-accent' : 'text-hawkins-accent'}`}>
                        {'>'}
                    </span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="TYPE COMMAND..."
                        autoFocus
                        className={`flex-1 bg-transparent border-none outline-none font-mono text-sm uppercase ${isUpsideDownMode
                            ? 'text-upside-down-text placeholder:text-upside-down-text/30'
                            : 'text-hawkins-text-primary placeholder:text-hawkins-text-dim/30'
                            }`}
                    />
                </div>
            </div>
        </div>
    );
}
