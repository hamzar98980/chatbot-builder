
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { toggleCollapsedNav } from '../../redux/action/Theme';
import '@xyflow/react/dist/style.css';
import { Disc, X, MessageCircle, Image, Headphones, Phone, Calendar } from 'react-feather';
import { Button, Card, Col, Row, Offcanvas } from 'react-bootstrap';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import sampleImage from "../../assets/sample-image.jpg";
import '../../App.css';
import ComponentModal from './ComponentModa';

import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Handle,
    Position
} from '@xyflow/react';
import { Pointer } from 'tabler-icons-react';
import axios from 'axios';


const initialNodes = [
    { id: '1', position: { x: 100, y: 50 }, data: { label: 'Start' }, type: 'custom' },
    { id: '2', position: { x: 300, y: 150 }, data: { label: 'Process' }, type: 'custom' },
    { id: '3', position: { x: 500, y: 250 }, data: { label: 'End' }, type: 'custom' },
];

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },  // Smooth connecting line
    { id: 'e2-3', source: '2', target: '3', type: 'smoothstep' },  // Smooth connecting line
];


const BotBuilder = ({ toggleCollapsedNav }) => {

    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [openCard, setOpenCard] = useState(true);
    const [refreshCard, setRefreshCard] = useState(false);
    const [maxiMize, setMaxiMize] = useState(false);
    const [show, setShow] = useState(false);
    const [cards, setCards] = useState([]);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [selectedNode, setSelectedNode] = useState(0);
    const [lgShow, setLgShow] = useState(false);
    const [nodeIdComponent, setNodeIdComponent] = useState(null);
    const [selectedComponentID, setSelectedComponentID] = useState(null);

    const alignNodes = (nodes, edges) => {
        // Create a map of node IDs to node data
        const nodeMap = new Map(nodes.map(node => [node.id, node]));
        const sourceToTargets = edges.reduce((acc, edge) => {
            if (!acc[edge.source]) {
                acc[edge.source] = [];
            }
            acc[edge.source].push(edge.target);
            return acc;
        }, {});

        // Function to find the next node in the sequence
        const findNextNode = (currentNodeId) => {
            const targets = sourceToTargets[currentNodeId] || [];
            return targets.map(targetId => ({
                id: targetId,
                ...nodeMap.get(targetId)
            }));
        };

        // Find the starting node (nodes without any incoming edges)
        const startNodeIds = nodes.map(node => node.id).filter(id =>
            !edges.some(edge => edge.target === id)
        );

        // Generate the sequence of nodes
        const sequence = [];
        const visited = new Set();

        const traverse = (nodeId) => {
            if (visited.has(nodeId)) return;
            visited.add(nodeId);
            const node = nodeMap.get(nodeId);
            if (node) {
                sequence.push(node);
                const nextNodes = findNextNode(nodeId);
                nextNodes.forEach(nextNode => traverse(nextNode.id));
            }
        };

        startNodeIds.forEach(startNodeId => traverse(startNodeId));
        return sequence;
    };

    const addCardData = (alignNodes) => {
        Object.entries(cards).forEach(([key, value]) => {
            const nodeIndex = alignNodes.findIndex(obj => obj.id == key);
            if (nodeIndex != null) {
                alignNodes[nodeIndex]['nodeData'] = value;

            }
        });
        return alignNodes;
    }

    const onConnect = useCallback(
        (params) => {
            setEdges((eds) => {
                const updatedEdges = eds.filter(edge => edge.source !== params.source);
                return addEdge({ ...params, type: 'smoothstep' }, updatedEdges);
            });
        },
        [setEdges],
    );


    function generateUniqueCode() {
        const code = Math.floor(100000 + Math.random() * 900000);
        return code.toString();
    }

    const addComponentToNode = ({ label, id, type, message, component_category }) => {
        setCards((prevCards) => {
            const nodeCards = prevCards[selectedNode] || []; // Get existing components for the selected node
            let prevMessage = '';
            if (type == 'file') {
                prevMessage = sampleImage;
            }
            const updatedCards = [...nodeCards, {
                label, id, data: {
                    message: prevMessage,
                    type: type,
                    mindate: '',
                    maxdate: ''
                },
                uid: generateUniqueCode(),
                component_category,

            }];
            return {
                ...prevCards,
                [selectedNode]: updatedCards, // Update the components for the selected node
            };
        });
    };

    const addNode = () => {
        setNodes((prevNodes) => {
            const lastNodeId = parseInt(prevNodes[prevNodes.length - 1].id);
            const newNodeId = (lastNodeId + 1).toString();
            const newNode = {
                id: newNodeId,
                position: { x: 1200, y: 500 },
                data: { label: `Node ${newNodeId}` },
                type: 'custom'
            };
            return [...prevNodes, newNode];
        });
    }



    useEffect(() => {
        toggleCollapsedNav(false);
    }, [])

    const otherCustomNodes = ({ id, data, isConnectable }) => {
        if (data.label == 'Start' || data.label == 'End') {
            return startandEndNode({ id, data, isConnectable });
        } else {

            return (
                <Col lg={6} sm={12} style={{ width: 350 }}>

                    <Card className={classNames("card-refresh", { "fullscreen": maxiMize })}>
                        <Handle
                            type="target"
                            position={Position.Top}
                            id="t"
                            style={{
                                background: '#555',
                                width: 10,
                                height: 10,
                                borderRadius: '100%',
                            }}
                            isConnectable={isConnectable}
                        />

                        <div className={classNames("refresh-container", { "la-animate": refreshCard })}>
                            <div className="loader-pendulums" />
                        </div>
                        <Card.Header className="card-header-action">
                            <h6>{data.label}</h6>
                            <div className="card-action-wrap">

                                <Link to="#" className="btn btn-xs btn-icon btn-rounded btn-flush-dark flush-soft-hover refresh"  >
                                    <span className="icon"><span className="feather-icon">
                                        <Disc />
                                    </span></span>
                                </Link>

                                <a href="#card" className="btn btn-xs btn-icon btn-rounded btn-flush-dark flush-soft-hover card-close">
                                    <span className="icon"><span className="feather-icon">
                                        <X />
                                    </span></span>
                                </a>
                            </div>
                        </Card.Header>

                        <div id="example-collapse-card" className="card-body">
                            <h5 className="card-title">Special Title Treatment</h5>
                            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>

                            <div id={'node-' + id}>
                                {cards[id] && Array.isArray(cards[id]) && cards[id].map((val, ind) => {

                                    let styling = {};
                                    if (val.data.type == 'file') {
                                        styling = { display: 'flex', };
                                    } else {

                                        styling = { display: 'flex', alignItems: "start" };
                                    }
                                    let componentMessage = val.data.message;

                                    // return <div key={ind}>{val}</div>;  // Render each card component
                                    return <Card key={ind} className="mt-3" style={{ backgroundColor: '#fafafa', boxShadow: 'none', borderColor: '#e4e4e7' }}>
                                        <Card.Body onClick={() => {

                                            setLgShow(!lgShow)
                                            setSelectedComponentID(val.uid)
                                            setNodeIdComponent(id)


                                        }}>
                                            <div style={styling} className='gap-2'>
                                                <span className="feather-icon mt-1" style={{ fontSize: 18, color: '#007D88' }}>
                                                    {
                                                        val.data.type == 'text' ? (<MessageCircle />) :
                                                            val.data.type == 'file' ? (<Image />) :
                                                                val.data.type == 'audio' ? (<Headphones />) :
                                                                    val.data.type == 'date' ? (<Calendar />) :
                                                                        ''
                                                    }
                                                </span>

                                                {
                                                    val.data.type == 'text' ? (<div dangerouslySetInnerHTML={{ __html: componentMessage ?? 'Click To Edit' }} />)
                                                        : val.data.type == 'file' ? (
                                                            <div>
                                                                <img style={{ height: 150, width: 240, borderRadius: 10 }} className="preview-image" src={val.data.message} alt="brand" />
                                                            </div>
                                                        ) : val.data.type == 'audio' ? (
                                                            <>
                                                                <audio controls>
                                                                    <source src={componentMessage} type="audio/ogg" />
                                                                </audio>
                                                            </>
                                                        ) : val.data.type == 'date' ? (
                                                            componentMessage != null && componentMessage != '' ? (<>{componentMessage}</>) : (<>{'Pick a date'}</>)

                                                        ) : ''
                                                }

                                            </div>
                                        </Card.Body>
                                    </Card>;
                                })}

                            </div>
                            <Row>
                                <Button variant="outline-light" onClick={() => {
                                    setShow((prevShow) => !prevShow);
                                    setSelectedNode(id);
                                }}>+ Add Card</Button>
                            </Row>

                        </div>

                        <Card.Footer className="text-muted">
                            <Handle
                                type="source"
                                position={Position.Bottom}
                                id="b"
                                style={{
                                    background: '#555',
                                    width: 10,
                                    height: 10,
                                    borderRadius: '100%',
                                }}
                                isConnectable={isConnectable}
                            />
                        </Card.Footer>
                    </Card>

                </Col >
            );
        }
    }

    const startandEndNode = ({ id, data, isConnectable }) => {
        return (
            <Col lg={6} sm={12}>
                <Card className={classNames("card-refresh", { "fullscreen": maxiMize })}>
                    <Handle
                        type="target"
                        position={Position.Top}
                        id="t"
                        style={{
                            background: '#555',
                            width: 10,
                            height: 10,
                            borderRadius: '100%',
                        }}
                        isConnectable={isConnectable}
                    />

                    <div className={classNames("refresh-container", { "la-animate": refreshCard })}>
                        <div className="loader-pendulums" />
                    </div>
                    <Card.Header className="card-header-action">
                        <h6>{data.label}</h6>
                        <div className="card-action-wrap">
                        </div>
                    </Card.Header>

                    <div id="example-collapse-card" className="card-body">
                        <h5 className="card-title">Special Title Treatment</h5>
                        <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                    </div>

                    <Card.Footer className="text-muted">
                        <Handle
                            type="source"
                            position={Position.Bottom}
                            id="b"
                            style={{
                                background: '#555',
                                width: 10,
                                height: 10,
                                borderRadius: '100%',
                            }}
                            isConnectable={isConnectable}
                        />
                    </Card.Footer>
                </Card>
            </Col >
        );
    }

    const nodeTypes = {
        custom: otherCustomNodes,
    };

    const edgeStyles = {
        'smoothstep': {
            stroke: '#fff',  // White color for smoothstep edges
        },
    };

    return (
        <div style={{ width: '100vw', height: '100vh', backgroundColor: '#1e1e1e' }}>

            <ComponentModal lgShow={lgShow} setLgShow={setLgShow} nodeIdComponent={nodeIdComponent} selectedComponentID={selectedComponentID} cards={cards} setCards={setCards} />

            <Offcanvas show={show} onHide={() => setShow(!show)}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Components</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Row>
                        <h6><b>Bubbles</b></h6>
                        <Col sm={6}>
                            <Card style={{ backgroundColor: '#fafafa', boxShadow: 'none', borderColor: '#e4e4e7', cursor: 'Pointer' }} className={classNames("card-refresh", { "fullscreen": maxiMize })} onClick={() => addComponentToNode({ label: 'Text', id: 1, type: 'text', message: null, component_category: "Bubbles" })}>
                                <div className={classNames("refresh-container", { "la-animate": refreshCard })}>
                                    <div className="loader-pendulums" />
                                </div>
                                <Card.Header className="card-header-action">
                                    <h6>Text</h6>
                                    <div className="card-action-wrap">
                                        <a href="javascript:;" className="btn btn-xs btn-icon btn-rounded btn-flush-dark flush-soft-hover card-close">
                                            <span className="icon">
                                                <span className="feather-icon" style={{ fontSize: 20 }}>
                                                    <MessageCircle />
                                                </span>
                                            </span>
                                        </a>
                                    </div>
                                </Card.Header>
                            </Card>
                        </Col>
                        <Col sm={6}>
                            <Card style={{ backgroundColor: '#fafafa', boxShadow: 'none', borderColor: '#e4e4e7', cursor: 'Pointer' }} className={classNames("card-refresh", { "fullscreen": maxiMize })} onClick={() => addComponentToNode({ label: 'File', id: 2, type: 'file', message: null, component_category: "Bubbles" })}>
                                <div className={classNames("refresh-container", { "la-animate": refreshCard })}>
                                    <div className="loader-pendulums" />
                                </div>
                                <Card.Header className="card-header-action">
                                    <h6>Image</h6>
                                    <div className="card-action-wrap">
                                        <a href="javascript:;" className="btn btn-xs btn-icon btn-rounded btn-flush-dark flush-soft-hover card-close">
                                            <span className="icon" >
                                                <span className="feather-icon" style={{ fontSize: 20 }}>
                                                    <Image />
                                                </span>
                                            </span>
                                        </a>
                                    </div>
                                </Card.Header>
                            </Card>
                        </Col>
                        <Col sm={6}>
                            <Card style={{ backgroundColor: '#fafafa', boxShadow: 'none', borderColor: '#e4e4e7', cursor: 'Pointer' }} className={classNames("card-refresh", { "fullscreen": maxiMize })} onClick={() => addComponentToNode({ label: 'audio', id: 3, type: 'audio', message: null, component_category: "Bubbles" })}>
                                <div className={classNames("refresh-container", { "la-animate": refreshCard })}>
                                    <div className="loader-pendulums" />
                                </div>
                                <Card.Header className="card-header-action">
                                    <h6>Audio</h6>
                                    <div className="card-action-wrap">
                                        <a href="javascript:;" className="btn btn-xs btn-icon btn-rounded btn-flush-dark flush-soft-hover card-close">
                                            <span className="icon" >
                                                <span className="feather-icon" style={{ fontSize: 20 }}>
                                                    <Headphones />
                                                </span>
                                            </span>
                                        </a>
                                    </div>
                                </Card.Header>
                            </Card>
                        </Col>
                    </Row>
                    <Row className='mt-3'>
                        <h6><b>Inputs</b></h6>
                        <Col sm={6}>
                            <Card style={{ backgroundColor: '#fafafa', boxShadow: 'none', borderColor: '#e4e4e7', cursor: 'Pointer' }} className={classNames("card-refresh", { "fullscreen": maxiMize })} onClick={() => addComponentToNode({ label: 'calendar', id: 4, type: 'date', message: null, component_category: "Inputs" })}>
                                <div className={classNames("refresh-container", { "la-animate": refreshCard })}>
                                    <div className="loader-pendulums" />
                                </div>
                                <Card.Header className="card-header-action">
                                    <h6>Date</h6>
                                    <div className="card-action-wrap">
                                        <a href="javascript:;" className="btn btn-xs btn-icon btn-rounded btn-flush-dark flush-soft-hover card-close">
                                            <span className="icon" >
                                                <span className="feather-icon" style={{ fontSize: 20 }}>
                                                    <Calendar />
                                                </span>
                                            </span>
                                        </a>
                                    </div>
                                </Card.Header>
                            </Card>
                        </Col>
                    </Row>
                </Offcanvas.Body>
            </Offcanvas>

            <Row>
                <Col sm={3} style={{ padding: 10, marginLeft: 15 }}>
                    <Button style={{ marginRight: 10 }} onClick={() => {

                        let alingedNodesObj = alignNodes(nodes, edges);
                        let nodesWithCards = addCardData(alingedNodesObj);
                        console.log(nodesWithCards);
                        let chatbotBuilder = axios.post('https://demo-laravel-proj.test/api/create-chatbot', nodesWithCards);
                        console.log(chatbotBuilder);

                    }}>Update Bot</Button>

                    <Button onClick={() => addNode()}>+ Add Node</Button>
                </Col>
            </Row>


            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}  // Use custom node types
                edgeStyles={edgeStyles}  // Apply custom edge styles
            >
                <Controls />
                <Background variant="dots" gap={12} size={1} color="#333" />
            </ReactFlow>

        </div>

    )
}

const mapStateToProps = ({ theme }) => {
    const { navCollapsed } = theme;
    return { navCollapsed }
};

export default connect(mapStateToProps, { toggleCollapsedNav })(BotBuilder);