import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import {
  Container,
  Nav,
  Navbar,
  Tab,
} from "react-bootstrap";
import {useState} from "react";
import {Stylesheet, useBodyAttributes, useImmerCtx} from "./Utils";
import {IngredientTab} from "./Ingredients"
import {IngredientCtx, ImmerCtx, RecipeStore, IngredientStore, RecipeCtx} from "./Context";
import {RecipeTab} from "./Recipes";

function HomeTab() {
  return <Container><p>Home</p></Container>
}

function MainContent() {
  let [activeTab, setActiveTab] = useState("home");

  function setTab(eventKey) {
    console.log(eventKey);
    setActiveTab(eventKey);
  }

  return <>
    <Stylesheet url="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
    <Container fluid className="pt-2">
      <Navbar
        className="bg-body-tertiary"
        onSelect={setTab}
      >
        <Container fluid>
          <Navbar.Brand>Reciplanner</Navbar.Brand>
          <Nav
            className="me-auto"
            defaultActiveKey="home"
          >
            <Nav.Item><Nav.Link eventKey="home">Home</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="ingredients">Ingredients</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="recipes">Recipes</Nav.Link></Nav.Item>
          </Nav>
        </Container>
      </Navbar>

      <Tab.Container
        activeKey={activeTab}
        id="main-tabs"
        variant="pills"
      >
        <Tab.Content>
          <Tab.Pane eventKey="home"><HomeTab /></Tab.Pane>
          <Tab.Pane eventKey="ingredients" title="Ingredients">
            <IngredientTab/>
          </Tab.Pane>
          <Tab.Pane eventKey="recipes" title="Recipes">
            <RecipeTab/>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  </>;
}

function App() {
  useBodyAttributes({"data-bs-theme": "dark"});
  let ingredients = useImmerCtx(new IngredientStore());
  let recipes = useImmerCtx(new RecipeStore());

  return <IngredientCtx.Provider value={ingredients}>
    <RecipeCtx.Provider value={recipes}>
      <MainContent />
    </RecipeCtx.Provider>
  </IngredientCtx.Provider>;
}

export default App;
