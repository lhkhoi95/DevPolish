'use client';

import './gh.css';
import { useEffect } from 'react';

const GitHubContribGraph = ({ githubUsername }: { githubUsername?: string }) => {

    useEffect(() => {
        const fetchData = async () => {
            if (!githubUsername) return; // Ensure githubUsername is defined
            const response = await fetch(
                `https://lengthylyova.pythonanywhere.com/api/gh-contrib-graph/fetch-data/?githubLogin=${githubUsername}`,
                { method: 'GET' }
            );
            const data = await response.json();
            return data['data']['user'];
        };

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

        const main = async () => {
            const container = document.getElementById('gh');
            if (!container) return; // Ensure container is not null
            const ghLogin = container.dataset.login;
            const data = await fetchData();
            const calendar = data['contributionsCollection']['contributionCalendar'];
            const [table, thead, tbody] = initTable();
            const card = initCard();
            const canvas = initCanvas();
            const header = initHeader(
                calendar['totalContributions'],
                ghLogin!,
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

        main();
    }, [githubUsername]);

    return (
        <div className="border pt-1 rounded-xl text-muted-foreground flex items-center justify-center min-h-screen overflow-x-auto">
            <div id="gh" data-login={githubUsername}></div>
        </div>
    );
};

export default GitHubContribGraph;