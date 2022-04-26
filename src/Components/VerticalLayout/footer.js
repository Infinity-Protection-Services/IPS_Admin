import { Container, Row, Col } from "reactstrap";
import React from 'react'

function Footer() {
    return (
        <React.Fragment>
            <footer className="footer">
                <Container fluid={true}>
                    <Row>
                        <Col md={6}>
                        </Col>
                        <Col md={6}>
                            <div className="text-sm-right d-none d-sm-block">
                            </div>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </React.Fragment>
    );
}

export default React.memo(Footer)