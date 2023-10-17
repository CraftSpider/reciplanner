import {Button, Col, Container, Form, ListGroup, Modal, Row} from "react-bootstrap";
import {useContext, useState} from "react";
import {RecipeCtx, Recipe} from "./Context";
import {Icon} from "./Utils";

/**
 * @param {Element} form
 * @return {Recipe}
 */
function recipeFromForm(form) {
  let name;
  let ingredients;

  for (const child of form.children) {
    let input = child.getElementsByTagName("input")[0];
    switch (input?.id) {
      case "recipe-name":
        name = input.value;
        break;
      case "recipe-ingredients":
        // TODO: Handle this correctly
        ingredients = input.value;
        break;
      default:
        break;
    }
  }

  return new Recipe(name, ingredients);
}

function RecipeItem({ recipe }) {
  let recipes = useContext(RecipeCtx);

  function removeRecipe() {
    recipes.update(draft => draft.removeRecipe(recipe));
  }

  return <>
    <Row>
      <Col><p>{recipe.name}</p></Col>
      <Col xs="auto"><Button variant="outline-danger" onClick={removeRecipe}><Icon name="trash" /></Button></Col>
    </Row>
    <Row>
      <Col><p className="text-secondary">Ingredients: {recipe.ingredients.length}</p></Col>
    </Row>
  </>;
}

function RecipeDetails({ recipe }) {
  let recipes = useContext(RecipeCtx);

  if (recipe === null) {
    return <h3 className="mt-4 text-center">Select a Recipe to view/edit details.</h3>
  }

  /**
   * @param {Event} event
   */
  function updateRecipe(event) {
    event.preventDefault();

    let recipe = recipeFromForm(event.target);
    recipes.update(draft => {
      let oldRecipe = draft.getByName(recipe.name);
      oldRecipe.ingredients = recipe.ingredients;
    })
  }

  return <RecipeForm recipe={recipe} onSubmit={updateRecipe}/>
}

function RecipeForm({ recipe, onSubmit, adding }) {
  let name = recipe?.name;

  return <Form key={name} action="" onSubmit={onSubmit}>
    <Form.Group controlId="recipe-name">
      <Form.Label>Name</Form.Label>
      <Form.Control value={name} disabled={!adding}></Form.Control>
    </Form.Group>
  </Form>
}

export function RecipeTab() {
  let [selected, setSelected] = useState("");
  let [adding, setAdding] = useState(false);

  let recipes = useContext(RecipeCtx);

  function addOnClick() {
    setAdding(true);
  }

  /**
   * @param {Recipe} recipe
   * @returns {function(): void}
   */
  function recipeOnClick(recipe) {
    return () => setSelected(recipe.name);
  }

  function addRecipeClose() {
    setAdding(false);
  }

  /**
   * @param {Event} event
   */
  function addRecipeSubmit(event) {
    event.preventDefault();

    setAdding(false);

    let recipe = recipeFromForm(event.target);

    recipes.update(draft => {
      console.log("Adding recipe " + recipe.name);
      if (!draft.addRecipe(recipe)) {
        alert("There's already a recipe with that name");
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
                  placeholder="Recipe Search"
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
              recipes.access(inner =>
                inner.all().map(recipe => {
                  let active = recipe.name === selected;
                  let className = "";
                  if (active) {
                    className = "bg-dark-subtle";
                  }

                  return <ListGroup.Item
                    action
                    key={recipe.name}
                    className={className}
                    onClick={recipeOnClick(recipe)}
                    active={active}
                  >
                    <RecipeItem recipe={recipe} />
                  </ListGroup.Item>;
                })
              )
            }
          </ListGroup>
        </Col>
        <Col className="m-2">
          <RecipeDetails recipe={recipes.access(inner => inner.getByName(selected))}/>
        </Col>
      </Row>
    </Container>

    <Modal show={adding} onHide={addRecipeClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Recipe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <RecipeForm adding={true} onSubmit={addRecipeSubmit} />
      </Modal.Body>
    </Modal>
  </>;
}
