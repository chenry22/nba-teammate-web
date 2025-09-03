import playerData from "./data/players.json";

const teams = {
    "MIA" : "#98002e", "LAL" : "#552583", "BOS" : "#007a33", "LAC" : "#c8102e", "BRK" : "#000000",
    "CHO" : "#00788c", "CHI" : "#ce1141", "ATL" : "#e03a3e", "PHO" : "#e56020", "DAL" : "#00538c", 
    "DEN" : "#fec524", "DET" : "#c8102e", "GSW" : "#ffc72c", "HOU" : "#ce1141", "IND" : "#fdbb30", 
    "MEM" : "#5d76a9", "MIL" : "#00471b", "MIN" : "#0c2340", "NOP" : "#85714d", "NYK" : "#f58426",
    "OKC" : "#007ac1", "ORL" : "#0077c0", "PHI" : "#006bb6", "POR" : "#e03a3e", "SAC" : "#5a2d81", 
    "SAS" : "#a5a7a8ff", "TOR" : "#ce1141", "UTA" : "#002b5c", "CLE" : "#860038", "WAS" : "#002b5c",
}

Object.keys(teams).forEach((t) => {
    var teamDiv = document.createElement('div');
    teamDiv.id = t;
    teamDiv.className = "team-div closed";
    teamDiv.style = 'border: 2px solid ' + teams[t] + "; background-color: " + teams[t] + "30;";

    var teamDivHeader = document.createElement('span');
    teamDivHeader.className = 'team-header';
    var teamName = document.createElement('h4');
    teamName.innerText = t + " | 2024-25 Regular Season";

    var dropdown = document.createElement('button');
    dropdown.id = t + "-toggle";
    dropdown.innerHTML = "Open";
    dropdown.onclick = () => {
        let closed = document.getElementById(t).classList.toggle('closed');
         document.getElementById(t + "-toggle").innerText = closed ? "Open" : "Close";
    };

    teamDivHeader.appendChild(teamName);
    teamDivHeader.appendChild(dropdown);
    teamDiv.appendChild(teamDivHeader);
    document.getElementById('player-index').appendChild(teamDiv);
})

playerData.sort((a, b) => Number(b.win_shares) - Number(a.win_shares));
playerData.map(n => {
    if(n.year === "2024-25") {
        var player = document.createElement('div');
        let stats = `<p>GP: ${n.games_played}, GS: ${n.games_started}, Mins: ${n.minutes_played}, WS: ${n.win_shares}, BPM: ${n.box_plus_minus}</p>`;
        player.innerHTML = `<p><a href='/nba-teammate-web/players?id=${n.id}'>${n.player}</a></p>${stats}`;
        document.getElementById(n.team).appendChild(player);
    }
});

