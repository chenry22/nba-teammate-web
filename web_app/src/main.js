import Sigma from "sigma";
import Graph from "graphology";
import forceAtlas2 from 'graphology-layout-forceatlas2';
import FA2Layout from 'graphology-layout-forceatlas2/worker';

import playerData from "../public/data/players.json";
import lineupData from "../public/data/lineups/2024-25.json";

const teams = {
    "MIA" : "#98002e", "LAL" : "#552583", "BOS" : "#007a33", "LAC" : "#c8102e", "BRK" : "#000000",
    "CHO" : "#00788c", "CHI" : "#ce1141", "ATL" : "#e03a3e", "PHO" : "#e56020", "DAL" : "#00538c", 
    "DEN" : "#fec524", "DET" : "#c8102e", "GSW" : "#ffc72c", "HOU" : "#ce1141", "IND" : "#fdbb30", 
    "MEM" : "#5d76a9", "MIL" : "#00471b", "MIN" : "#0c2340", "NOP" : "#85714d", "NYK" : "#f58426",
    "OKC" : "#007ac1", "ORL" : "#0077c0", "PHI" : "#006bb6", "POR" : "#e03a3e", "SAC" : "#5a2d81", 
    "SAS" : "#c4ced4", "TOR" : "#ce1141", "UTA" : "#002b5c", "CLE" : "#860038", "WAS" : "#002b5c",
}
const team_to_color = {
    "MIA" : "#c10c42ff", "LAL" : "#6e399fff", "BOS" : "#099a45ff", "LAC" : "#e82042ff", "BRK" : "#000000",
    "CHO" : "#0595aeff", "CHI" : "#db2150ff", "ATL" : "#f14e50ff", "PHO" : "#f96d2cff", "DAL" : "#0a65a2ff", 
    "DEN" : "#ffd563ff", "DET" : "#d72946ff", "GSW" : "#ffd768ff", "HOU" : "#e61a4dff", "IND" : "#ffca57ff", 
    "MEM" : "#718cc1ff", "MIL" : "#00702bff", "MIN" : "#203d61ff", "NOP" : "#ab9265ff", "NYK" : "#fc943fff",
    "OKC" : "#1290daff", "ORL" : "#228dd0ff", "PHI" : "#1184d5ff", "POR" : "#f44a4aff", "SAC" : "#7c48aaff", 
    "SAS" : "#d7d7d7ff", "TOR" : "#e42051ff", "UTA" : "#0d498dff", "CLE" : "#a10e4bff", "WAS" : "#8d146fff",
    "CHA" : "#058fa8ff", "PHX" : "#fa844eff", "BKN" : "#525252"
}

const graph = new Graph({ multi: true });

Object.keys(teams).forEach((key, _) => {
    graph.addNode(key, { 
        color : teams[key], size : 12, 
        label: key,
        x : Math.random(), y : Math.random() });
});
playerData.forEach(n => {
    if(n.year === "2024-25") {
        if(!graph.hasNode(n.id)){
            var val = ((Number(n.games_played) / 2.0) + Number(n.games_started)) / 82.0 + Number(n.win_shares) / 2.5;
            graph.addNode(n.id, { 
                label: n.player, color: teams[n.team], 
                size: Math.min(1 + val, 8),
                x: Math.random(), y: Math.random()
            });
        }
        graph.addEdge(n.id, n.team, {
            color: team_to_color[n.team]
        });
    }
});
lineupData.forEach(e => {
    if(Number(e.min) > 50.0 && graph.hasNode(e.player1) && graph.hasNode(e.player2)){
        graph.addEdge(e.player1, e.player2, { 
            color: team_to_color[e.team], 
            label: "GP: " + e.gp + ", GS: " + e.gs
        });
    }
});

const settings = {
    gravity: 1.2, strongGravityMode: true,
    adjustSizes: true,
    scalingRatio: 14, slowDown: 2.5
};
const layout = new FA2Layout(graph, { settings });
layout.start();
// forceAtlas2.assign(graph, { iterations: 200, settings });
const renderer = new Sigma(graph, document.getElementById("container"));

// allow button to toggle physics
document.getElementById("physics_toggler").addEventListener('click', e => {
    layout.isRunning() ? layout.stop() : layout.start();
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
        data.color = "#e2dfdfff";
    } else if (selectedNode === node){
        data.highlighted = true;
    }
    return data;
});
// hide nodes not connected to selected
renderer.setSetting("edgeReducer", (edge, data) => {
    if (selectedNode &&
        !graph.extremities(edge).every((n) => n === selectedNode || graph.areNeighbors(n, selectedNode))
    ) {
        data.hidden = true;
    }
    return data;
});