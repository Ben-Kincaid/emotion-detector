import React, { useState, useEffect } from "react";

// Types & Interfaces
import { StoreState } from "types/index";

// Lib
import { connect } from "react-redux";
import _get from "lodash.get";

// Components
import FAWebcam from "components/FAWebcam/index";

import "./Home.scss";

interface HomeProps {
  modelsLoading: boolean;
}

function Home(props: HomeProps) {
  const { modelsLoading } = props;
  const [expressionHueShift, setExpressionHueShift] = useState<string>("0deg");
  const [expression, setExpression] = useState<any | null>(null);

  const onExpressionChange = (expressions: any | null) => {
    if (!expressions) return;
    const expression = Object.keys(expressions as any)
      .sort((a, b) => expressions[b] - expressions[a])
      .map(expressionName => ({
        [expressionName]: expressions[expressionName]
      }))[0];
    setExpression(expression);
  };

  useEffect(() => {
    const createExpressionHueShift = (expressionName: string) => {
      switch (expressionName) {
        case "surprised":
        case "happy": {
          return "90deg";
        }
        case "fearful":
        case "disgusted":
        case "angry":
        case "sad": {
          return "180deg";
        }
        default:
          return "0deg";
      }
    };
    if (!expression) return;

    setExpressionHueShift(createExpressionHueShift(Object.keys(expression)[0]));
  }, [expression]);

  return (
    <div
      style={{
        backgroundColor: "black",
        transition: "0.35s background-color ease-out"
      }}
      className="home"
    >
      {!modelsLoading && (
        <>
          <div className="expression-title">
            <h5>{!expression ? "Loading..." : Object.keys(expression)[0]}</h5>
          </div>
          <div
            className="expression-container"
            style={{
              filter: `hue-rotate(${expressionHueShift})`,
              transition: "0.2s filter ease-out"
            }}
          >
            <FAWebcam
              expression={expression}
              onExpressionChange={onExpressionChange}
            />
          </div>
        </>
      )}
    </div>
  );
}

const mapState = (state: StoreState) => ({
  modelsLoading: _get(state.global.loading, "models.loading", true)
});

export default connect(mapState)(Home);
