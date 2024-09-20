'use client';

import { Skeleton } from '@/components/ui/skeleton';
import './gh.css';
import { useEffect, useState } from 'react';

const GitHubContribGraph = ({ githubUsername }: { githubUsername?: string }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!githubUsername) {
                setError('No GitHub username provided');
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `https://lengthylyova.pythonanywhere.com/api/gh-contrib-graph/fetch-data/?githubLogin=${githubUsername}`,
                    { method: 'GET' }
                );
                const result = await response.json();
                setData(result['data']['user']);
            } catch (error) {
                console.error("Error fetching GitHub data:", error);
                setError(error instanceof Error ? error.message : String(error));
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [githubUsername]);

    useEffect(() => {
        if (!data) return;

        const initTable = (): [HTMLTableElement, HTMLTableSectionElement, HTMLTableSectionElement] => {
            const table = document.createElement('table');
            table.className = 'ghCalendarTable';
            const thead = table.createTHead();
            const tbody = table.createTBody();
            const row = thead.insertRow();
            const cell = row.insertCell();
            cell.style.width = '28px';
            for (let i = 0; i < 7; i++) {
                const row = tbody.insertRow();
                const cell = row.insertCell();
                switch (i) {
                    case 1:
                        cell.innerHTML = '<span class="ghCalendarLabel">Mon</span>';
                        break;
                    case 3:
                        cell.innerHTML = '<span class="ghCalendarLabel">Wed</span>';
                        break;
                    case 5:
                        cell.innerHTML = '<span class="ghCalendarLabel">Fri</span>';
                        break;
                }
            }
            return [table, thead, tbody];
        };

        const addMonths = (thead: HTMLTableSectionElement, months: { name: string; totalWeeks: number }[]) => {
            for (let i = 0; i < months.length; i++) {
                const total_weeks = months[i]['totalWeeks'];
                if (total_weeks >= 2) {
                    const cell = thead.rows[0].insertCell();
                    const label = document.createElement('span');
                    label.textContent = months[i]['name'];
                    label.className = 'ghCalendarLabel';
                    cell.appendChild(label);
                    cell.colSpan = months[i]['totalWeeks'];
                }
            }
        };

        const addWeeks = (tbody: HTMLTableSectionElement, weeks: { contributionDays: any[] }[], _: string[]) => {
            for (let i = 0; i < weeks.length; i++) {
                const days = weeks[i]['contributionDays'];
                for (let j = 0; j < days.length; j++) {
                    const day = days[j];
                    const data = document.createElement('span');
                    const date = new Date(day['date']);
                    data.textContent = `${day['contributionCount']} contributions on ${date.toDateString()}`;
                    const cell = tbody.rows[day['weekday']].insertCell();
                    cell.appendChild(data);
                    cell.className = 'ghCalendarDayCell';
                    cell.dataset.date = day['date'];
                    cell.dataset.count = day['contributionCount'];
                    cell.dataset.level = day['contributionLevel'];
                }
            }
        };

        const initCard = () => {
            const card = document.createElement('div');
            card.className = 'ghCalendarCard';
            return card;
        };

        const initCardFooter = () => {
            const footer = document.createElement('div');
            const colors = document.createElement('div');
            footer.className = 'ghCalendarCardFooter';
            colors.className = 'ghCalendarCardFooterColors';
            const less = document.createElement('span');
            less.textContent = 'Less';
            const more = document.createElement('span');
            more.textContent = 'More';
            colors.appendChild(less);
            const levels = [
                'NONE',
                'FIRST_QUARTILE',
                'SECOND_QUARTILE',
                'THIRD_QUARTILE',
                'FOURTH_QUARTILE',
            ];
            for (let i = 0; i < 5; i++) {
                const cell = document.createElement('div');
                cell.className = 'ghCalendarDayCell';
                cell.dataset.level = levels[i];
                colors.appendChild(cell);
            }
            colors.appendChild(more);
            footer.appendChild(colors);
            return footer;
        };

        const initCanvas = () => {
            const canvas = document.createElement('div');
            canvas.className = 'ghCalendarCanvas';
            return canvas;
        };

        const initHeader = (totalContribs: number, ghLogin: string, _: string) => {
            const header = document.createElement('div');
            const total = document.createElement('span');
            const profile = document.createElement('div');
            profile.innerHTML = `<a href="https://github.com/${ghLogin}" target="_blank">${ghLogin}</a>`;
            header.className = 'ghCalendarHeader';
            total.textContent = `${totalContribs} GitHub contributions in the last year`;
            header.appendChild(total);
            header.appendChild(profile);
            return header;
        };

        const renderGraph = () => {
            const container = document.getElementById('gh');
            if (!container) return;
            const calendar = data['contributionsCollection']['contributionCalendar'];
            const [table, thead, tbody] = initTable();
            const card = initCard();
            const canvas = initCanvas();
            const header = initHeader(
                calendar['totalContributions'],
                githubUsername!,
                data['avatarUrl']
            );
            const footer = initCardFooter();

            container.innerHTML = ''; // clear existing content
            addWeeks(tbody, calendar['weeks'], calendar['colors']);
            addMonths(thead, calendar['months']);
            canvas.appendChild(table);
            canvas.appendChild(footer);
            card.appendChild(canvas);
            container.appendChild(header);
            container.appendChild(card);
        };

        renderGraph();
    }, [data, githubUsername]);

    if (isLoading) {
        return (
            <div className="pt-1 rounded-xl text-muted-foreground flex flex-col items-center justify-center min-h-48 w-full overflow-x-auto space-y-4">
                <div className='flex justify-between w-[95%]'>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-[200px] w-[95%]" />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <div className="pt-1 rounded-xl text-muted-foreground flex items-start justify-start min-h-48 w-full mt-8">
            <div id="gh" data-login={githubUsername}></div>
        </div>
    );
};

export default GitHubContribGraph;