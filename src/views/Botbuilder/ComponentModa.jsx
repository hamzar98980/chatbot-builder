import { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';

const ComponentModal = ({ lgShow, setLgShow, nodeIdComponent, selectedComponentID, cards, setCards }) => {
    const [componentType, setComponentType] = useState(null);
    const [componentMessage, setComponentMessage] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [minDate, setMinDate] = useState('');
    const [maxDate, setMaxDate] = useState('');
    const [minnumber, setMinnumber] = useState(null);
    const [maxnumber, setMaxnumber] = useState(null);
    const [phoneCountryCode, setPhoneCountryCode] = useState(null);

    useEffect(() => {
        if (cards[nodeIdComponent] && Array.isArray(cards[nodeIdComponent])) {
            const index = cards[nodeIdComponent].findIndex(item => item.uid === selectedComponentID);
            if (index !== -1) {
                const result = cards[nodeIdComponent][index];

                setComponentType(result.data.type);
                setComponentMessage(result.data.message)
                setMinDate(result.data.mindate)
                setMaxDate(result.data.maxdate)
                setSelectedIndex(index);
                setMinnumber(result.data.minnumber);
                setMaxnumber(result.data.maxnumber);
                setPhoneCountryCode(result.data.phonecountry_code);
            } else {
                console.log('No matching object found');
            }
        } else {
            console.error(`cards[${nodeIdComponent}] is undefined or not an array`);
        }
    }, [nodeIdComponent, selectedComponentID, cards]);

    const handleSaveChanges = () => {
        if (selectedIndex !== null && cards[nodeIdComponent]) {
            const updatedComponents = [...cards[nodeIdComponent]];
            const updatedComponent = {
                ...updatedComponents[selectedIndex],
                data: {
                    ...updatedComponents[selectedIndex].data,
                    message: componentMessage,
                    mindate: minDate,
                    maxdate: maxDate,
                    minnumber: minnumber,
                    maxnumber: maxnumber,
                    phonecountry_code: phoneCountryCode
                }
            };
            updatedComponents[selectedIndex] = updatedComponent;
            const updatedCards = {
                ...cards,
                [nodeIdComponent]: updatedComponents
            };
            setCards(updatedCards);
        }
        setComponentType(null)
        setComponentMessage('');
        setSelectedIndex(null)
        setLgShow(false); // Close the modal
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setComponentMessage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Modal
            size="lg"
            show={lgShow}
            onHide={() => setLgShow(false)}
            aria-labelledby="example-modal-sizes-title-lg"
        >
            <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">
                    Component Detail
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    componentType == 'message' ? (
                        <div>
                            <label htmlFor="">Enter Message</label>
                            <input type="text" className='form-control' value={componentMessage} onChange={(e) => setComponentMessage(e.target.value)} />
                        </div>
                    ) : componentType == 'file' ? (
                        <>
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>Select File</Form.Label>
                                <Form.Control type="file" onChange={handleFileChange} />
                            </Form.Group>
                            <img style={{ height: 150, width: 240, borderRadius: 10 }} className="preview-image" src={componentMessage} alt="brand" />
                        </>
                    ) : componentType == 'audio' ? (
                        <>
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>Select File</Form.Label>
                                <Form.Control type="file" onChange={handleFileChange} />
                            </Form.Group>
                            {componentMessage && (
                                <audio controls src={componentMessage} style={{ width: '100%' }}>
                                    Your browser does not support the audio element.
                                </audio>
                            )}
                        </>
                    ) : componentType == 'date' ? (
                        <>
                            <Row>
                                <Col sm={4}>
                                    <Form.Group controlId="" className="mb-3">
                                        <Form.Label>Min:</Form.Label>
                                        <Form.Control type="date" value={minDate} onChange={(e) => setMinDate(e.target.value)} />
                                    </Form.Group>
                                </Col>
                                <Col sm={4}>
                                    <Form.Group controlId="" className="mb-3">
                                        <Form.Label>Max:</Form.Label>
                                        <Form.Control type="date" value={maxDate} onChange={(e) => setMaxDate(e.target.value)} />
                                    </Form.Group>
                                </Col>
                                <Col sm={4}>
                                    <Form.Group controlId="" className="mb-3">
                                        <Form.Label>Formate</Form.Label>
                                        <Form.Control type="text" value={componentMessage} onChange={(e) => setComponentMessage(e.target.value)} placeholder="dd/MM/YYYY" />
                                    </Form.Group>
                                </Col>

                            </Row>

                        </>
                    ) : componentType == 'number' ? (
                        <>
                            <Row>
                                <Col sm={4}>
                                    <Form.Group controlId="" className="mb-3">
                                        <Form.Label>Min: </Form.Label>
                                        <Form.Control type="number" value={minnumber} onChange={(e) => setMinnumber(e.target.value)} />
                                    </Form.Group>
                                </Col>
                                <Col sm={4}>
                                    <Form.Group controlId="" className="mb-3">
                                        <Form.Label>Max: </Form.Label>
                                        <Form.Control type="number" value={maxnumber} onChange={(e) => setMaxnumber(e.target.value)} />
                                    </Form.Group>
                                </Col>

                            </Row>

                        </>
                    ) :
                        componentType == 'phone' ? (
                            <>
                                <Row>
                                    <Col sm={6}>
                                        <Form.Group controlId="" className="mb-3">
                                            <Form.Label>Default country:  </Form.Label>
                                            <Form.Select value={phoneCountryCode} defaultValue="International" onChange={(e) => setPhoneCountryCode(e.target.value)} >
                                                <option>International</option>
                                                <option >Pakistan (+92)</option>
                                                <option value={'USA'}>United States Of America (+1)</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                            </>
                        ) :
                            (<div></div>)
                }

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setLgShow(false)}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => {
                    handleSaveChanges();

                }}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal >
    );
}

export default ComponentModal