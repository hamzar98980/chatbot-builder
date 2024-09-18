import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

const ComponentModal = ({ lgShow, setLgShow, nodeIdComponent, selectedComponentID, cards, setCards }) => {
    const [componentType, setComponentType] = useState(null);
    const [componentMessage, setComponentMessage] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(null);



    useEffect(() => {
        if (cards[nodeIdComponent] && Array.isArray(cards[nodeIdComponent])) {
            const index = cards[nodeIdComponent].findIndex(item => item.uid === selectedComponentID);
            if (index !== -1) {
                const result = cards[nodeIdComponent][index];
                setComponentType(result.data.type);
                setComponentMessage(result.data.message)
                setSelectedIndex(index);
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
                    message: componentMessage
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
                    componentType == 'text' ? (
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
                    ) : (<div></div>)
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