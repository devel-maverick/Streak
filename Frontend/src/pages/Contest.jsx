import React, { useState, useEffect } from 'react';
import { useContestStore } from '../store/useContestStore';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function Contest() {
    const { contests, fetchContests, isLoading } = useContestStore();
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        fetchContests();
    }, [fetchContests]);

    const codeforcesContests = contests.filter(c => c.platform === 'CODEFORCES');

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const isSameDay = (date1, date2) => {
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
    };

    const getContestsForDay = (day) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return codeforcesContests.filter(c => {
            const contestDate = new Date(c.startTime);
            return isSameDay(contestDate, date);
        });
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 sm:h-32 border border-gray-100 bg-gray-50/30"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayContests = getContestsForDay(day);
            const isToday = isSameDay(date, new Date());

            days.push(
                <div
                    key={day}
                    className={`h-24 sm:h-32 border border-gray-100 p-2 transition-colors relative overflow-hidden
                        ${isToday ? 'bg-blue-50/50 font-semibold' : 'bg-white hover:bg-gray-50'}
                    `}
                >
                    <span className={`text-sm w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-gray-700'}`}>
                        {day}
                    </span>

                    <div className="mt-1 space-y-1 overflow-y-auto max-h-[calc(100%-30px)] no-scrollbar">
                        {dayContests.map(contest => {
                            const isEnded = new Date() > new Date(contest.endTime);
                            const styles = isEnded
                                ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                                : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100';

                            return (
                                <a
                                    key={contest.id}
                                    href={contest.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`flex items-center gap-1 p-1.5 rounded border text-[10px] sm:text-xs font-medium truncate transition-colors cursor-pointer ${styles}`}
                                    title={contest.title}
                                >
                                    <img
                                        src="https://cdn.iconscout.com/icon/free/png-256/free-codeforces-3628695-3029920.png"
                                        alt="CF"
                                        className="w-3 h-3 object-contain flex-shrink-0"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                    <span className="truncate">{contest.title}</span>
                                </a>
                            );
                        })}
                    </div>
                </div>
            );
        }

        return days;
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 sm:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <h1 className="text-3xl font-black tracking-tight text-gray-900 flex items-center gap-3">
                        <span className="bg-gray-600 border border-black text-white p-2 rounded-lg"><CalendarIcon size={24} /></span>
                        Codeforces Calendar
                    </h1>

                    <div className="flex items-center gap-4 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                        <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <span className="text-lg font-bold text-gray-800 w-40 text-center select-none">
                            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </span>
                        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden w-full">

                    <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                        {DAYS.map(day => (
                            <div key={day} className="py-3 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7">
                        {renderCalendar()}
                    </div>
                </div>
            </div>
        </div>
    );
}