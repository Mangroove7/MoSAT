declare namespace Desmos {
  interface CalculatorOptions {
    keypad?: boolean;
    graphingCalc?: boolean;
    expressions?: boolean;
    settingsMenu?: boolean;
    zoomButtons?: boolean;
    border?: boolean;
    lockViewport?: boolean;
    pointsOfInterest?: boolean;
    trace?: boolean;
  }

  interface ExpressionState {
    id: string;
    latex?: string;
    color?: string;
    lineStyle?: string;
    sliderBounds?: { min: string; max: string; step?: string };
  }

  interface Calculator {
    setExpression(state: ExpressionState): void;
    setBlank(): void;
    getState(): object;
    setState(state: object): void;
    destroy(): void;
    resize(): void;
  }

  function GraphingCalculator(
    element: HTMLElement,
    options?: CalculatorOptions
  ): Calculator;
}

interface Window {
  Desmos?: typeof Desmos;
}
