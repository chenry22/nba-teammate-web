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

const min_minutes = 20.0;
const teams = {
    "MIA" : "#98002e", "LAL" : "#552583", "BOS" : "#007a33", "LAC" : "#c8102e", "BRK" : "#000000",
    "CHO" : "#00788c", "CHI" : "#ce1141", "ATL" : "#e03a3e", "PHO" : "#e56020", "DAL" : "#00538c", 
    "DEN" : "#fec524", "DET" : "#c8102e", "GSW" : "#ffc72c", "HOU" : "#ce1141", "IND" : "#fdbb30", 
    "MEM" : "#5d76a9", "MIL" : "#00471b", "MIN" : "#0c2340", "NOP" : "#85714d", "NYK" : "#f58426",
    "OKC" : "#007ac1", "ORL" : "#0077c0", "PHI" : "#006bb6", "POR" : "#e03a3e", "SAC" : "#5a2d81", 
    "SAS" : "#a5a7a8ff", "TOR" : "#ce1141", "UTA" : "#002b5c", "CLE" : "#860038", "WAS" : "#002b5c",
}
const team_to_color = {
    "MIA" : "#c10c42e0", "LAL" : "#6e399fe0", "BOS" : "#099a45e0", "LAC" : "#e82042e0", "BRK" : "#000000e0",
    "CHO" : "#0595aee0", "CHI" : "#db2150e0", "ATL" : "#f14e50e0", "PHO" : "#f96d2ce0", "DAL" : "#0a65a2e0", 
    "DEN" : "#ffd563e0", "DET" : "#d72946e0", "GSW" : "#ffd768e0", "HOU" : "#e61a4de0", "IND" : "#ffca57e0", 
    "MEM" : "#718cc1e0", "MIL" : "#00702be0", "MIN" : "#203d61e0", "NOP" : "#ab9265e0", "NYK" : "#fc943fe0",
    "OKC" : "#1290dae0", "ORL" : "#228dd0e0", "PHI" : "#1184d5e0", "POR" : "#f44a4ae0", "SAC" : "#7c48aae0", 
    "SAS" : "#c3c1c1e0", "TOR" : "#e42051e0", "UTA" : "#0d498de0", "CLE" : "#a10e4be0", "WAS" : "#8d146fe0",
    "CHA" : "#058fa8e0", "PHX" : "#fa844ee0", "BKN" : "#525252e0"
}
var names = {};

const graph = new Graph({ multi: true });
graph.addNode(playerID, { 
    label: playerID, size: 24,
    x: Math.random(), y: Math.random()
});

playerData.forEach(n => {
    if(n.id === playerID) {
        graph.updateNode(playerID, attr => {
            return { ...attr, label: n.player, color: teams[n.team] };
        })

        var weighted_gp = ((Number(n.games_played) / 2.0) + Number(n.games_started)) / 100.0
        if(!graph.hasNode(n.team)) {
            var val = weighted_gp + Math.max(Number(n.win_shares), 1.0) / 2.8;
            graph.addNode(n.team, { 
                label: n.team, color: teams[n.team], 
                size: 10.0 + val,
                x: Math.random(), y: Math.random()
            });
        }

        var team_val = 0.5 * weighted_gp * Math.max(Number(n.win_shares), 1.0) * Math.max(Number(n.box_plus_minus), 1.0);
        graph.addEdge(n.id, n.team, {
            color: team_to_color[n.team],
            size: Math.min(Math.max(team_val, 0.1), 5)
        });
    } else {
        names[n.id] = n.player;
    }
});

function addTeammate(e) {
    if(Number(e.min) >= min_minutes && (Number(e.player1) === playerID || Number(e.player2) === playerID)){
        var otherID = Number(e.player1) === playerID ? Number(e.player2) : Number(e.player1);
        var val = Number(e.win_pct) * Number(e.min) * Math.max(Number(e.e_net_rating), 0.5) / 1500.0
        if(!graph.hasNode(otherID)) {
            graph.addNode(otherID, { 
                label: names[otherID] ? names[otherID] : e.label, 
                size: 4 + val, color: teams[e.team],
                x: Math.random(), y: Math.random(), 
            });
        }

        graph.addEdge(e.player1, e.player2, { 
            color : team_to_color[e.team], 
            label : "GP: " + e.gp + ", GS: " + e.gs,
            size : Math.min(Math.max(val, 0.1), 3.5)
        });
        graph.addEdge(otherID, e.team, { 
            color : team_to_color[e.team],
            size : 1.0
        });
    }
}
lineups25.forEach(e => addTeammate(e));
lineups24.forEach(e => addTeammate(e));
lineups23.forEach(e => addTeammate(e));
lineups22.forEach(e => addTeammate(e));
lineups21.forEach(e => addTeammate(e));
lineups20.forEach(e => addTeammate(e));
lineups19.forEach(e => addTeammate(e));
lineups18.forEach(e => addTeammate(e));
lineups17.forEach(e => addTeammate(e));
lineups16.forEach(e => addTeammate(e));
lineups15.forEach(e => addTeammate(e));
lineups14.forEach(e => addTeammate(e));
lineups13.forEach(e => addTeammate(e));
lineups12.forEach(e => addTeammate(e));
lineups11.forEach(e => addTeammate(e));
lineups10.forEach(e => addTeammate(e));
lineups09.forEach(e => addTeammate(e));
lineups08.forEach(e => addTeammate(e));

const settings = {
    gravity: 2, adjustSizes: true,
    edgeWeightInfluence: 1,
    scalingRatio: 10, slowDown: 4
};
const layout = new FA2Layout(graph, { settings });
layout.start();
// forceAtlas2.assign(graph, { iterations: 200, settings });
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

// Taken from Sigma examples
// drag and drop
var draggedNode = null;
var isDragging = false;
renderer.on("downNode", (e) => {
    isDragging = true;
    draggedNode = e.node;
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
        graph.removeNodeAttribute(draggedNode, "highlighted");
    }
    isDragging = false;
    draggedNode = null;
};
renderer.on("upNode", handleUp);
renderer.on("upStage", handleUp);


// Allow click to select sub networks
var selectedNode = undefined;
renderer.on("clickNode", ({ node }) => {
    if(isDragging || draggedNode) { return; }
    selectedNode = node === selectedNode ? undefined : node;
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