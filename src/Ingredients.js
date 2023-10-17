import {Button, Col, Container, Form, ListGroup, Modal, Row} from "react-bootstrap";
import {useContext, useState} from "react";
import {Icon} from "./Utils";
import {Ingredient, IngredientCtx} from "./Context";

/**
 *
 * @param {Element} form
 * @returns {Ingredient}
 */
function ingredientFromForm(form) {
  let name;
  let count;
  let expiry;

  for (const child of form.children) {
    let input = child.getElementsByTagName("input")[0];
    switch (input?.id) {
      case "ingredient-name":
        name = input.value;
        break;
      case "ingredient-count":
        count = input.value;
        break;
      case "ingredient-expires":
        expiry = input.value;
        break;
      default:
        break;
    }
  }

  return new Ingredient(name, count, expiry);
}

function IngredientItem({ingredient}) {
  let ingredients = useContext(IngredientCtx);

  function removeIngredient() {
    ingredients.update(draft => draft.removeIngredient(ingredient));
  }

  return <>
    <Row>
      <Col><p>{ingredient.name}</p></Col>
      <Col xs="auto"><Button variant="outline-danger" onClick={removeIngredient}><Icon name="trash"/></Button></Col>
    </Row>
    <Row>
      <Col><p className="text-secondary">Count: {ingredient.count}</p></Col>
    </Row>
  </>;
}

function IngredientForm({ingredient, onSubmit, adding}) {
  let name = ingredient?.name;
  let count = ingredient?.count ?? 0;
  let expires = ingredient?.expires;

  return <Form key={name} action="" onSubmit={onSubmit}>
    <Form.Group controlId="ingredient-name">
      <Form.Label>Name</Form.Label>
      <Form.Control value={name} disabled={!adding}/>
    </Form.Group>
    <Form.Group controlId="ingredient-count">
      <Form.Label>Count</Form.Label>
      <Form.Control defaultValue={count}/>
      <Form.Text>
        Count, in units
      </Form.Text>
    </Form.Group>
    <Form.Group controlId="ingredient-expires">
      <Form.Label>Expires</Form.Label>
      <Form.Control defaultValue={expires}/>
      <Form.Text>
        Expiry Date. N/A if none.
      </Form.Text>
    </Form.Group>
    <Button type="submit">Save</Button>
  </Form>;
}

function IngredientDetails({ingredient}) {
  let ingredients = useContext(IngredientCtx);

  if (ingredient === null) {
    return <h3 className="mt-4 text-center">Select an Ingredient to view/edit details.</h3>;
  }

  /**
   * @param {Event} event
   */
  function updateIngredient(event) {
    event.preventDefault();

    let ingredient = ingredientFromForm(event.target);
    ingredients.update(draft => {
      let oldIngredient = draft.getByName(ingredient.name);
      oldIngredient.count = ingredient.count;
      oldIngredient.expires = ingredient.expires;
    });
  }

  return <IngredientForm ingredient={ingredient} onSubmit={updateIngredient}/>;
}

export function IngredientTab() {
  let [selected, setSelected] = useState("");
  let [adding, setAdding] = useState(false);

  let ingredients = useContext(IngredientCtx);

  function addOnClick() {
    setAdding(true);
  }

  /**
   *
   * @param {Ingredient} ingredient
   * @returns {function(): void}
   */
  function ingredientOnClick(ingredient) {
    return () => setSelected(ingredient.name);
  }

  function addIngredientClose() {
    setAdding(false);
  }

  /**
   * @param {Event} event
   */
  function addIngredientSubmit(event) {
    event.preventDefault();

    setAdding(false);

    let ingredient = ingredientFromForm(event.target);

    ingredients.update(draft => {
      console.log("Adding ingredient " + ingredient.name);
      if (!draft.addIngredient(ingredient)) {
        alert("There's already an ingredient with that name");
      }
    });
  }

  return <>
    <Container fluid className="mb-3">
      <Row className="bg-body-tertiary pb-2">
        <Col>
          {/* TODO: Make search work */}
          <Form inline>
            <Row>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Ingredient Search"
                />
              </Col>
              <Col xs="auto">
                <Button type="submit"><Icon name="search"/></Button>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col xs="auto"><Button variant="success" onClick={addOnClick}><Icon name="plus-lg"/></Button></Col>
      </Row>
    </Container>
    <Container>
      <Row>
        <Col xs={4}>
          <ListGroup>
            {
              /** @type ReactNode[] */
              ingredients.access(inner => inner.all().map(ingredient => {
                let active = ingredient.name === selected;
                let className = "";
                // Override the 'active' background color
                if (active) {
                  className = "bg-dark-subtle";
                }

                return <ListGroup.Item
                  action
                  key={ingredient.name}
                  className={className}
                  onClick={ingredientOnClick(ingredient)}
                  active={active}
                >
                  <IngredientItem ingredient={ingredient}/>
                </ListGroup.Item>;
              }))
            }
          </ListGroup>
        </Col>
        <Col className="m-2">
          <IngredientDetails ingredient={ingredients.access(inner => inner.getByName(selected))}/>
        </Col>
      </Row>
    </Container>

    <Modal show={adding} onHide={addIngredientClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Ingredient</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <IngredientForm adding={true} onSubmit={addIngredientSubmit}/>
      </Modal.Body>
    </Modal>
  </>;
}
