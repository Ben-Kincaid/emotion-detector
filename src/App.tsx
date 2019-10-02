import React, { useEffect } from "react";

//Types & Interfaces
import { setLoading, SetLoading } from "duck/actions";
import { StoreState, RootAction, LoadingStatusTypes } from "types";
import { Dispatch } from "redux";

// Lib
import { connect } from "react-redux";
import _get from "lodash.get";
import * as faceapi from "face-api.js";

// Components
import { Home } from "components/Home/index";

import "App.scss";

interface AppProps {
  modelsLoading: boolean;
}

interface DispatchProps {
  setLoading: Function;
}

function App(props: AppProps & DispatchProps) {
  const { setLoading } = props;

  useEffect(() => {
    const loadModels = async () => {
      setLoading("models", "REQUEST");
      try {
        await faceapi.loadSsdMobilenetv1Model("./models");
        await faceapi.loadFaceLandmarkModel("./models");
        await faceapi.loadFaceRecognitionModel("./models");
        await faceapi.loadFaceExpressionModel("./models");
      } catch (error) {
        setLoading("models", "FAILED");
        throw error;
      }
      setLoading("models", "SUCCESS");
    };
    loadModels();
  }, []);

  return (
    <div className="App">
      <Home />
    </div>
  );
}

const mapState = (state: StoreState) => ({
  modelsLoading: _get(state.global.loading, "models.loading", true)
});

const mapDispatch = (dispatch: Dispatch<RootAction>): DispatchProps => ({
  setLoading: (name: string, status: LoadingStatusTypes) =>
    dispatch(setLoading(name, status))
});

export default connect(
  mapState,
  mapDispatch
)(App);
