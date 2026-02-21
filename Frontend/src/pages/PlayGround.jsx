import { useState, useCallback, useEffect, useRef } from "react";
import { usePlaygroundStore } from "../store/usePlaygroundStore";
import Editor from "@monaco-editor/react";
import {
    Play,
    Copy,
    Download,
    Trash2,
    ChevronDown,
    Loader2,
    Sparkles,
    Zap,
    MessageSquareText,
    Check,
    X,
    Send,
    Lock,
    Clock,
    Database
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import ReactMarkdown from 'react-markdown';

const LANGUAGES = [
    { value: "cpp", label: "C++", mono: "cpp" },
    { value: "c", label: "C", mono: "c" },
    { value: "python", label: "Python", mono: "python" },
    { value: "java", label: "Java", mono: "java" },
    { value: "javascript", label: "JavaScript", mono: "javascript" },
    { value: "csharp", label: "C#", mono: "csharp" },
    { value: "go", label: "Go", mono: "go" },
    { value: "rust", label: "Rust", mono: "rust" },
];

const AI_MODELS = [
    { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
    { value: "llama-3.3-70b-versatile", label: "Llama 3.3 70B (Groq)" },
    { value: "llama-3.1-8b-instant", label: "Llama 3.1 8B (Groq)" },
    { value: "mixtral-8x7b-32768", label: "Mixtral 8x7B (Groq)" },
    { value: "gemma2-9b-it", label: "Gemma 2 9B (Groq)" },
];

const BOILERPLATE = {
    cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n\n    // Your code here\n\n    return 0;\n}`,
    c: `#include <stdio.h>\n\nint main() {\n    // Your code here\n\n    return 0;\n}`,
    python: `# Your code here\nprint("Hello, World!")`,
    java: `public class Main {\n    public static void main(String[] args) {\n        // Your code here\n        System.out.println("Hello, World!");\n    }\n}`,
    javascript: `// Your code here\nconsole.log("Hello, World!");`,
    csharp: `using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        // Your code here\n        Console.WriteLine("Hello, World!");\n    }\n}`,
    go: `package main\n\nimport "fmt"\n\nfunc main() {\n    // Your code here\n    fmt.Println("Hello, World!")\n}`,
    rust: `fn main() {\n    // Your code here\n    println!("Hello, World!");\n}`,
};

export default function Playground() {
    const {
        language,
        setLanguage,
        code,
        setCode,
        input,
        setInput,
        output,
        isRunning,
        runCode,
        isAiGenerating,
        analyzeCode,
        optimizeCode,
        explainCode,
        chatWithAI,
        chatHistory,
        selectedModel,
        setSelectedModel,
    } = usePlaygroundStore();
    const { user } = useAuthStore();
    const isPro = user?.subscriptionPlan === 'PRO';

    const [showLangDropdown, setShowLangDropdown] = useState(false);
    const [showModelDropdown, setShowModelDropdown] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const chatEndRef = useRef(null);
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory, showChat]);

    const currentLang = LANGUAGES.find((l) => l.value === language) || LANGUAGES[0];
    const currentModel = AI_MODELS.find((m) => m.value === selectedModel) || AI_MODELS[0];

    const handleLanguageChange = useCallback((lang) => {
        setLanguage(lang);
        setCode(BOILERPLATE[lang] || "");
        setShowLangDropdown(false);
    }, [setLanguage, setCode]);

    const handleRun = useCallback(async () => {
        console.log("Run Code triggered");
        if (isRunning || !code.trim()) return;
        await runCode(code, language, input);
    }, [isRunning, code, language, input, runCode]);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [code]);

    const handleDownload = useCallback(() => {
        const ext = { cpp: "cpp", c: "c", python: "py", java: "java", javascript: "js", csharp: "cs", go: "go", rust: "rs" };
        const blob = new Blob([code], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `playground.${ext[language] || "txt"}`;
        a.click();
        URL.revokeObjectURL(url);
    }, [code, language]);

    const handleClear = useCallback(() => {
        setCode("");
        setInput("");
    }, [setCode, setInput]);

    const handleAiAction = async (actionType) => {
        console.log("AI button Clicked:", actionType);
        setShowChat(true);
        if (actionType === 'time' || actionType === 'space') await analyzeCode(code, language, actionType);
        if (actionType === 'optimize') await optimizeCode(code, language);
        if (actionType === 'explain') await explainCode(code, language);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!chatInput.trim() || isAiGenerating) return;

        await chatWithAI(chatInput, { language, code });
        setChatInput("");
    };

    const getOutputDisplay = () => {
        if (isRunning) return null;
        if (!output) return null;

        let text = "";
        if (output.stdout) text += output.stdout;
        if (output.stderr) text += (text ? "\nError:\n" : "") + output.stderr;
        if (output.compile_output) text += (text ? "\nCompilation Error:\n" : "") + output.compile_output;

        return text || (output.status?.description ? `Status: ${output.status.description}` : "No output produced");
    };

    const outputText = getOutputDisplay();

    return (
        <div className="flex flex-col h-[calc(100vh-66px)] overflow-hidden bg-white">
            {/* ─── Header ─────────────────────────────────── */}
            <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shrink-0">
                <div className="flex items-center gap-6">
                    <h1 className="text-xl font-bold text-gray-900 m-0 tracking-tight">Playground</h1>

                    {/* Language Dropdown */}
                    <div className="relative">
                        <button
                            className="flex items-center gap-2 px-3 py-1.5 rounded bg-white border border-gray-300 text-gray-700 text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors min-w-[120px] justify-between"
                            onClick={() => setShowLangDropdown(!showLangDropdown)}
                        >
                            <span>{currentLang.label}</span>
                            <ChevronDown
                                size={14}
                                className={`transition-transform duration-200 text-gray-500 ${showLangDropdown ? "rotate-180" : ""}`}
                            />
                        </button>
                        {showLangDropdown && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowLangDropdown(false)} />
                                <div className="absolute top-[calc(100%+4px)] left-0 bg-white border border-gray-200 rounded-lg p-1 min-w-[120px] z-50 shadow-lg">
                                    {LANGUAGES.map((lang) => (
                                        <button
                                            key={lang.value}
                                            className={`block w-full px-3 py-2 text-sm text-left rounded cursor-pointer transition-colors ${language === lang.value ? "bg-gray-100 text-gray-900 font-semibold" : "text-gray-600 hover:bg-gray-50"
                                                }`}
                                            onClick={() => handleLanguageChange(lang.value)}
                                        >
                                            {lang.label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        className={`flex items-center justify-center w-9 h-9 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors ${showChat ? 'bg-indigo-50 text-indigo-600' : ''}`}
                        onClick={() => setShowChat(!showChat)}
                        title="Toggle AI Chat"
                    >
                        <MessageSquareText size={18} />
                    </button>
                    <div className="w-[1px] h-6 bg-gray-200 mx-1"></div>
                    <button
                        className="flex items-center justify-center w-9 h-9 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        onClick={handleCopy}
                        title={copied ? "Copied!" : "Copy code"}
                    >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                    <button
                        className="flex items-center justify-center w-9 h-9 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        onClick={handleDownload}
                        title="Download code"
                    >
                        <Download size={18} />
                    </button>
                    <button
                        className="flex items-center justify-center w-9 h-9 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        onClick={handleClear}
                        title="Clear editor"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
            {/*BODY*/}
            <div className="flex flex-1 overflow-hidden">
                {/* Editor & I/O Container */}
                <div className={`flex flex-col md:flex-row flex-1 transition-all duration-300 ${showChat ? 'mr-0' : ''}`}>
                    {/* Editor */}
                    <div className="flex-[1.5] min-w-0 min-h-[300px] md:min-h-0 bg-[#1e1e1e]">
                        <Editor
                            height="100%"
                            language={currentLang.mono}
                            value={code}
                            onChange={(val) => setCode(val || "")}
                            theme="vs-dark"
                            options={{
                                fontSize: 14,
                                fontFamily: "'JetBrains Mono', monospace",
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                padding: { top: 16, bottom: 16 },
                                lineNumbers: "on",
                                renderLineHighlight: "gutter",
                                automaticLayout: true,
                                tabSize: 4,
                                wordWrap: "on",
                                cursorBlinking: "smooth",
                                cursorSmoothCaretAnimation: "on",
                                smoothScrolling: true,
                                bracketPairColorization: { enabled: true },
                            }}
                        />
                    </div>

                    {/*input output panel*/}
                    <div className="flex-1 flex flex-col border-t border-gray-200 md:border-t-0 md:border-l bg-white min-w-[300px]">
                        {/*input section*/}
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <div className="px-5 py-3 text-sm font-semibold text-gray-900 border-b border-gray-100 bg-white">
                                Input
                            </div>
                            <textarea
                                className="flex-1 w-full resize-none bg-gray-50/50 border-none outline-none text-gray-800 font-mono text-sm p-4 leading-relaxed placeholder-gray-400"
                                placeholder="Enter your input here..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                spellCheck={false}
                            />
                        </div>

                        <div className="h-[1px] bg-gray-100 shrink-0" />

                        {/*output section*/}
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <div className="px-5 py-3 text-sm font-semibold text-gray-900 border-b border-gray-100 bg-white">
                                Output
                            </div>
                            <div className="flex-1 overflow-auto p-4 bg-gray-50/50">
                                {isRunning ? (
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Running...</span>
                                    </div>
                                ) : outputText ? (
                                    <pre className="m-0 font-mono text-sm text-gray-800 whitespace-pre-wrap break-words leading-relaxed">
                                        {outputText}
                                    </pre>
                                ) : (
                                    <span className="text-gray-400 text-sm font-mono leading-relaxed">
                                        Click "Run" to see output
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/*ai chat*/}
                {showChat && (
                    <div className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-xl z-20 transition-all duration-300">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                                <Sparkles size={16} className="text-indigo-600" />
                                AI Assistant
                            </h2>
                            <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {chatHistory.length === 0 && (
                                <div className="text-center text-gray-500 mt-10 space-y-2">
                                    <div className="bg-indigo-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Sparkles size={20} className="text-indigo-600" />
                                    </div>
                                    <p className="font-medium">How can I help you?</p>
                                    <p className="text-xs">Ask me to analyze, optimize, or explain your code.</p>
                                </div>
                            )}

                            {chatHistory.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-lg p-3 text-sm ${msg.role === 'user'
                                        ? 'bg-gray-500 text-white rounded-br-none'
                                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                                        }`}>
                                        {msg.role === 'user' ? (
                                            <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
                                        ) : (
                                            (() => {
                                                try {
                                                    const data = JSON.parse(msg.content);
                                                    if (data.complexity && data.explanation) {
                                                        return (
                                                            <div className="flex flex-col gap-2">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-xs">
                                                                        {data.complexity}
                                                                    </span>
                                                                </div>
                                                                <p className="text-gray-700 leading-relaxed">
                                                                    {data.explanation}
                                                                </p>
                                                                {data.suggestions && data.suggestions.length > 0 && (
                                                                    <div className="mt-2 bg-gray-50 p-3 rounded-md border border-gray-100">
                                                                        <p className="font-semibold text-gray-900 text-xs mb-2 flex items-center gap-1">
                                                                            <Sparkles size={12} className="text-amber-500" />
                                                                            Suggestions
                                                                        </p>
                                                                        <ul className="list-disc list-inside space-y-1 text-gray-600 text-xs">
                                                                            {data.suggestions.map((suggestion, i) => (
                                                                                <li key={i}>{suggestion}</li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    }
                                                } catch (e) {
                                                }
                                                return (
                                                    <div className="markdown-body text-sm prose prose-sm max-w-none">
                                                        <ReactMarkdown>
                                                            {msg.content}
                                                        </ReactMarkdown>
                                                    </div>
                                                );
                                            })()
                                        )}
                                    </div>
                                </div>
                            ))}

                            {isAiGenerating && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-gray-200 rounded-lg p-3 rounded-bl-none shadow-sm flex items-center gap-2">
                                        <Loader2 size={16} className="animate-spin text-indigo-600" />
                                        <span className="text-sm text-gray-500">Thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        <div className="p-4 bg-white border-t border-gray-100">
                            <form onSubmit={handleSendMessage} className="relative">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder={!isPro ? "Upgrade to Pro to chat with AI" : "Type a message..."}
                                    disabled={!isPro || isAiGenerating}
                                    className={`w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all ${!isPro && "cursor-not-allowed opacity-60"
                                        }`}
                                />
                                <button
                                    type="submit"
                                    disabled={!isPro || !chatInput.trim() || isAiGenerating}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed p-1.5"
                                >
                                    <Send size={16} />
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {/*bottom runcode and ai buttons*/}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200 shrink-0">
                <button
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border-none text-white text-sm font-medium cursor-pointer transition-colors shadow-sm ${isRunning
                        ? "bg-gray-800 opacity-90 cursor-default"
                        : "bg-gray-900 hover:bg-black"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    onClick={handleRun}
                    disabled={isRunning || !code.trim()}
                >
                    {isRunning ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <Play size={16} fill="currentColor" />
                    )}
                    <span>{isRunning ? "Running..." : "Run Code"}</span>
                </button>

                <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
                    {/* AI Model Dropdown */}
                    <div className="relative">
                        <button
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black border border-gray-800 text-white text-sm font-medium cursor-pointer hover:bg-gray-900 transition-colors min-w-[160px] justify-between shadow-sm"
                            onClick={() => setShowModelDropdown(!showModelDropdown)}
                        >
                            <div className="flex items-center gap-2">
                                <Sparkles size={14} className="text-gray-300" />
                                <span>{currentModel.label}</span>
                            </div>
                            <ChevronDown
                                size={14}
                                className={`transition-transform duration-200 text-gray-400 ${showModelDropdown ? "rotate-180" : ""}`}
                            />
                        </button>
                        {showModelDropdown && (
                            <>
                                <div className="fixed inset-0 z-[100]" onClick={() => setShowModelDropdown(false)} />
                                <div className="absolute bottom-[calc(100%+8px)] left-0 bg-black border border-gray-800 rounded-lg p-1 min-w-[160px] z-[110] shadow-xl origin-bottom-left">
                                    {AI_MODELS.map((modelOption) => (
                                        <button
                                            key={modelOption.value}
                                            className={`block w-full px-3 py-2 text-sm text-left rounded-md cursor-pointer transition-colors ${selectedModel === modelOption.value ? "bg-gray-800 text-white font-semibold" : "text-gray-400 hover:bg-gray-900 hover:text-gray-200"
                                                }`}
                                            onClick={() => {
                                                setSelectedModel(modelOption.value);
                                                setShowModelDropdown(false);
                                            }}
                                        >
                                            {modelOption.label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => handleAiAction('time')}
                        disabled={!isPro || isAiGenerating}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm font-medium transition-all
                            ${!isPro ? "opacity-75 cursor-not-allowed" : "hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 group"}`}
                    >
                        <Clock size={16} />
                        <span>Time</span>
                        {!isPro && <Lock size={12} className="ml-1 opacity-60" />}
                    </button>
                    <button
                        onClick={() => handleAiAction('space')}
                        disabled={!isPro || isAiGenerating}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm font-medium transition-all
                            ${!isPro ? "opacity-75 cursor-not-allowed" : "hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 group"}`}
                    >
                        <Database size={16} />
                        <span>Space</span>
                        {!isPro && <Lock size={12} className="ml-1 opacity-60" />}
                    </button>
                    <button
                        onClick={() => handleAiAction('optimize')}
                        disabled={!isPro || isAiGenerating}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm font-medium transition-all
                            ${!isPro ? "opacity-75 cursor-not-allowed" : "hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 group"}`}
                    >
                        <Zap size={16} />
                        <span>Optimize</span>
                        {!isPro && <Lock size={12} className="ml-1 opacity-60" />}
                    </button>
                    <button
                        onClick={() => handleAiAction('explain')}
                        disabled={!isPro || isAiGenerating}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm font-medium transition-all
                            ${!isPro ? "opacity-75 cursor-not-allowed" : "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 group"}`}
                    >
                        <MessageSquareText size={16} />
                        <span>Explain</span>
                        {!isPro && <Lock size={12} className="ml-1 opacity-60" />}
                    </button>
                </div>
            </div>
        </div>
    );
}