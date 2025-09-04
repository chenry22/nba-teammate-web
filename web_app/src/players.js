import Sigma from "sigma";
import Graph from "graphology";
import FA2Layout from 'graphology-layout-forceatlas2/worker';

import playerData from "./data/players.json";
import lineups25 from "./data/lineups/2024-25.json";
import lineups24 from "./data/lineups/2023-24.json";
import lineups23 from "./data/lineups/2022-23.json";
import lineups22 from "./data/lineups/2021-22.json";
import lineups21 from "./data/lineups/2020-21.json";
import lineups20 from "./data/lineups/2019-20.json";
import lineups19 from "./data/lineups/2018-19.json";
import lineups18 from "./data/lineups/2017-18.json";
import lineups17 from "./data/lineups/2016-17.json";
import lineups16 from "./data/lineups/2015-16.json";
import lineups15 from "./data/lineups/2014-15.json";
import lineups14 from "./data/lineups/2013-14.json";
import lineups13 from "./data/lineups/2012-13.json";
import lineups12 from "./data/lineups/2011-12.json";
import lineups11 from "./data/lineups/2010-11.json";
import lineups10 from "./data/lineups/2009-10.json";
import lineups09 from "./data/lineups/2008-09.json";
import lineups08 from "./data/lineups/2007-08.json";

const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);
const playerID = Number(searchParams.get('id'));
var min_minutes = searchParams.has('mins') ? Math.max(Number(searchParams.get('mins')), 1) : 50.0;
var depth = searchParams.has('depth') ? Math.min(Math.max(Number(searchParams.get('depth')), 4), 1) : 1;

const lineups = [lineups25, lineups24, lineups23, lineups22, lineups21, lineups20,
    lineups19, lineups18, lineups17, lineups16, lineups15, 
    lineups14, lineups13, lineups12, lineups11, lineups10, 
    lineups09, lineups08
];
const teams = {
    "MIA" : "#98002e", "LAL" : "#552583", "BOS" : "#007a33", "LAC" : "#c8102e", "BRK" : "#000000",
    "CHO" : "#00788c", "CHI" : "#ce1141", "ATL" : "#e03a3e", "PHO" : "#e56020", "DAL" : "#00538c", 
    "DEN" : "#fec524", "DET" : "#c8102e", "GSW" : "#ffc72c", "HOU" : "#ce1141", "IND" : "#fdbb30", 
    "MEM" : "#5d76a9", "MIL" : "#00471b", "MIN" : "#0c2340", "NOP" : "#85714d", "NYK" : "#f58426",
    "OKC" : "#007ac1", "ORL" : "#0077c0", "PHI" : "#006bb6", "POR" : "#e03a3e", "SAC" : "#5a2d81", 
    "SAS" : "#a5a7a8", "TOR" : "#ce1141", "UTA" : "#002b5c", "CLE" : "#860038", "WAS" : "#002b5c",
    "SEA" : "#4a974a", "NOH" : "#2cb2c9"
};
const team_to_color = {
    "MIA" : "#c10c42e0", "LAL" : "#6e399fe0", "BOS" : "#099a45e0", "LAC" : "#e82042e0", "BRK" : "#000000e0",
    "CHO" : "#0595aee0", "CHI" : "#db2150e0", "ATL" : "#f14e50e0", "PHO" : "#f96d2ce0", "DAL" : "#0a65a2e0", 
    "DEN" : "#ffd563e0", "DET" : "#d72946e0", "GSW" : "#ffd768e0", "HOU" : "#e61a4de0", "IND" : "#ffca57e0", 
    "MEM" : "#718cc1e0", "MIL" : "#00702be0", "MIN" : "#203d61e0", "NOP" : "#ab9265e0", "NYK" : "#fc943fe0",
    "OKC" : "#1290dae0", "ORL" : "#228dd0e0", "PHI" : "#1184d5e0", "POR" : "#f44a4ae0", "SAC" : "#7c48aae0", 
    "SAS" : "#c3c1c1e0", "TOR" : "#e42051e0", "UTA" : "#0d498de0", "CLE" : "#a10e4be0", "WAS" : "#8d146fe0",
    "CHA" : "#058fa8e0", "PHX" : "#fa844ee0", "BKN" : "#525252e0", "NOH" : "#35c2dbe0", "SEA" : "#58b058e0"
}
var names = {};
var sumMinutes = {};
lineups.forEach(year => {
    year.forEach(e => {
        if(Number(e.player1) === playerID || Number(e.player2) === playerID) {
            var otherID = Number(e.player1) === playerID ? Number(e.player2) : Number(e.player1);
            sumMinutes[otherID] = Number(e.min) + (sumMinutes[otherID] ? sumMinutes[otherID] : 0);
        }
    });
});
playerData.forEach(p => { names[p.id] = p.player; });

const graph = new Graph({ multi: true });
const settings = {
    gravity: 1.85, adjustSizes: true,
    edgeWeightInfluence: 0.5,
    scalingRatio: 9, slowDown: 2
};
const layout = new FA2Layout(graph, { settings });
layout.start();

function addOrUpdateTeammateNode(id, label, team, val) {
    if(id === playerID) { return; }
    if(!graph.hasNode(id)) {
        graph.addNode(id, { 
            label: names[id] ? names[id] : label, 
            size: Math.min(2.5 + val, 12), color: teams[team],
            x: Math.random(), y: Math.random(), 
        });
    } else {
        graph.updateNode(id, attr => {
            return { ...attr, size: Math.min((attr.size + val), 12) };
        });
    }
}
function addTeammate(e, show) {
    var otherID = Number(e.player1) === playerID ? Number(e.player2) : Number(e.player1);
    var eitherIsPlayer = Number(e.player1) === playerID || Number(e.player2) === playerID;
    if((show.size === 1 && sumMinutes[Number(otherID)] >= min_minutes && (
            show.has(Number(e.player1)) || show.has(Number(e.player2))
        )) ||
        (show.size > 1 && 
            (eitherIsPlayer ? sumMinutes[otherID] > min_minutes : e.min > min_minutes) && 
            (show.has(Number(e.player1)) || show.has(Number(e.player2))))
    ){
        var team = e.team
        if(e.team === 'BKN'){ team = 'BRK'; }
        else if(e.team === 'CHA'){ team = 'CHO'; }
        else if(e.team === 'PHX'){ team = 'PHO'; }

        var val = Number(e.win_pct) * Number(e.min) * Math.max(Number(e.e_net_rating), 0.5) / 2500.0;
        val /= Math.pow(depth, 2);

        if(show.size > 1){
            addOrUpdateTeammateNode(e.player1, e.label.split(" - ")[0], team, val);
            addOrUpdateTeammateNode(e.player2, e.label.split(" - ")[1], team, val);
            if(!graph.hasNode(team)) {
                graph.addNode(team, { 
                    label: team, size: 8.0, color: teams[team],
                    x: Math.random(), y: Math.random(),
                });
            }
            graph.addEdge(e.player1, team, { 
                color : team_to_color[team],
                size : Math.min(Math.max(val, 0.5), 4)
            });
            graph.addEdge(e.player2, team, { 
                color : team_to_color[team],
                size : Math.min(Math.max(val, 0.5), 4)
            });
        } else {
            var lbl = Number(e.player1) === playerID ? e.label.split(" - ")[1] : e.label.split(" - ")[0];
            addOrUpdateTeammateNode(otherID, lbl, team, val);
            graph.addEdge(otherID, team, { 
                color : team_to_color[team],
                size : Math.min(Math.max(val, 0.5), 4)
            });
        }
        
        val *= 2;
        graph.addEdge(e.player1, e.player2, { 
            color : team_to_color[e.team], 
            label : "GP: " + e.gp + ", GS: " + e.gs,
            size : Math.min(Math.max(val, 0.5), 4)
        });
    }
}

function createNewNetwork() {
    graph.clear();
    if(!names[playerID]) {
        console.log("Player ID not found.");
        graph.addNode(playerID, { 
            label: "PLAYER NOT FOUND.", size: 50,
            x: Math.random(), y: Math.random()
        });
        document.getElementById("physics_toggler").innerText = "Toggle Physics (Disabled)"
        layout.stop();
        return;
    }

    graph.addNode(playerID, { 
        size: 24, highlighted: true,
        x: Math.random(), y: Math.random()
    });

    var i = depth;
    var shown = new Set([playerID]);
    while(i > 1){
        var toAdd = new Set();
        lineups.forEach(pairings => {
            pairings.forEach(e => {
                var eitherIsPlayer = Number(e.player1) === playerID || Number(e.player2) === playerID;
                if((shown.has(Number(e.player1)) || shown.has(Number(e.player2))) && 
                    (eitherIsPlayer ? sumMinutes[Number(e.player1 === playerID ? e.player2 : e.player1)] > min_minutes : e.min > min_minutes)
                ){
                    toAdd.add(Number(e.player1));
                    toAdd.add(Number(e.player2));
                }
            });
        });
        shown = shown.union(toAdd);
        i--;
    }

    playerData.forEach(n => {
        if(n.id === playerID) {
            graph.updateNode(playerID, attr => {
                return { ...attr, label: n.player, color: teams[n.team] };
            })

            var weighted_gp = ((Number(n.games_played) / 2.0) + Number(n.games_started)) / 200.0
            var val = weighted_gp + Math.max(Number(n.win_shares), 1.0) / 4;
            if(!graph.hasNode(n.team)) {
                graph.addNode(n.team, { 
                    label: n.team, color: teams[n.team], 
                    size: Math.min(4 + val, 18), highlighted: true,
                    x: Math.random(), y: Math.random()
                });
            } else {
                graph.updateNode(n.team, attr => {
                    return { ...attr, size: Math.min(attr.size + val, 18) };
                })
            }

            var team_val =  weighted_gp * Math.max(Number(n.win_shares), 1.0) * Math.max(Number(n.box_plus_minus), 1.0);
            graph.addEdge(n.id, n.team, {
                color: team_to_color[n.team],
                size: Math.min(Math.max(team_val, 0.1), 5)
            });
        }
    });

    // g othrough each file and year
    lineups.forEach(pairings => {
        pairings.forEach(e => addTeammate(e, shown));
    })
}

createNewNetwork();
const renderer = new Sigma(graph, document.getElementById("container"));
renderer.setSetting('zIndex', true);

// allow button to toggle physics
document.getElementById("physics_toggler").addEventListener('click', e => {
    layout.isRunning() ? layout.stop() : layout.start();
    document.getElementById("physics_toggler").innerText = layout.isRunning() ? "Toggle Physics (Enabled)" : "Toggle Physics (Disabled)"
});

// help button
document.getElementById("help-button").addEventListener('click', e => {
    document.getElementById("help-button-div").hidden = true;
    document.getElementById("help-text").hidden = false;
});
document.getElementById("close-button").addEventListener('click', e => {
    document.getElementById("help-button-div").hidden = false;
    document.getElementById("help-text").hidden = true;
});

// FILTER BUTTONS CONTROL
document.getElementById('min-slider').setAttribute('value', min_minutes);
document.getElementById('min-txt').setAttribute('value', min_minutes);
document.getElementById('min-txt').addEventListener('input', e => {
    min_minutes = e.target.value;
    document.getElementById('min-slider').setAttribute('value', e.target.value);
})
document.getElementById('min-slider').addEventListener('input', e => {
    min_minutes = e.target.value;
    document.getElementById('min-txt').setAttribute('value', e.target.value);
})
document.getElementById('apply-filters').addEventListener('click', e => {
    searchParams.set("mins", min_minutes);
    searchParams.set("depth", depth);
    if(depth > 1 && min_minutes < (70 * Math.pow(depth, 2))){
        if(confirm("The parameters you have entered will likely generate MANY nodes and edges. Enough to potentially crash the site. Continue anyways? Your device may process the resulting network slowly")) {
            createNewNetwork();
        }
    } else {
        createNewNetwork();
    }
})
// DEPTH
document.getElementById('depth-slider').setAttribute('value', depth);
document.getElementById('depth-slider').addEventListener('input', e => {
    depth = e.target.value;
    document.getElementById('depth-label').innerText = `Depth: ${depth}`;
})


// Taken from Sigma examples
// drag and drop
var draggedNode = null;
var isDragging = false;
var selectedNode = undefined;
var prevHighlighted = false;
renderer.on("downNode", (e) => {
    isDragging = true;
    draggedNode = e.node;
    prevHighlighted = graph.getNodeAttribute(draggedNode, "highlighted");
    graph.setNodeAttribute(draggedNode, "highlighted", true);
    if (!renderer.getCustomBBox()) renderer.setCustomBBox(renderer.getBBox());
});
renderer.on("moveBody", ({ event }) => {
    if (!isDragging || !draggedNode) return;
    const pos = renderer.viewportToGraph(event);
    graph.setNodeAttribute(draggedNode, "x", pos.x);
    graph.setNodeAttribute(draggedNode, "y", pos.y);

    // Prevent sigma to move camera:
    event.preventSigmaDefault();
    event.original.preventDefault();
    event.original.stopPropagation();
});
// On mouse up, we reset the dragging mode
const handleUp = () => {
    if (draggedNode) {
        graph.setNodeAttribute(draggedNode, "highlighted", prevHighlighted);
    }
    isDragging = false;
    draggedNode = null;
};
renderer.on("upNode", handleUp);
renderer.on("upStage", handleUp);

// Allow click to select sub networks
renderer.on("clickNode", ({ node }) => {
    if(isDragging || draggedNode) { return; }
    if(node === selectedNode) {
        graph.setNodeAttribute(node, 'highlighted', prevHighlighted)
        selectedNode = undefined;
    } else {
        selectedNode = node;
        prevHighlighted = graph.getNodeAttribute(node, 'highlighted');
    }
    renderer.refresh({ skipIndexation: true });
});
renderer.setSetting("nodeReducer", (node, data) => {
    if (selectedNode && 
        !(node === selectedNode || graph.areNeighbors(node, selectedNode))
    ) {
        data.color = "#d6d5d5ff";
    } else if (selectedNode === node){
        data.highlighted = true;
    }
    return data;
});
// hide nodes not connected to selected
renderer.setSetting("edgeReducer", (edge, data) => {
    if (selectedNode) {
        let nodes = graph.extremities(edge)
        if(!nodes.every((n) => n === selectedNode || graph.areNeighbors(n, selectedNode))){
            data.color = "#d6d5d5d3";
            data.zIndex = 1;
        } else if (nodes[0] !== selectedNode && nodes[1] !== selectedNode ) {
            data.color = "#c9c9c9d7";
            data.zIndex = 2;
        } else {
            data.zIndex = 3;
        }
    }
    return data;
});