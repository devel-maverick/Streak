import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function Contest() {
    return (
        <div className="min-h-screen bg-gray-50/50 p-4 sm:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-black tracking-tight text-gray-900 flex items-center gap-3">
                        <span className="bg-gray-600 border border-black text-white p-2 rounded-lg">
                            <CalendarIcon size={24} />
                        </span>
                        Contest Calendar
                    </h1>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden w-full h-[700px]">
                    <iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FKolkata&showPrint=0&showCalendars=0&showTz=0&src=Y29kZW1hdmVyaWNrMDBAZ21haWwuY29t&src=Y185YjBkMWM4MTcyMjdiMDkwNDRiODU1ODJlYjNjMTBlNmE3ZjRiZTA2MGE3N2QxNWMzOWJmMWZhNmYwNjAzZDg1QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20&color=%23039be5&color=%23e4c441"
                        style={{ border: 0 }}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no">
                    </iframe>
                </div>
            </div>
        </div>
    );
}