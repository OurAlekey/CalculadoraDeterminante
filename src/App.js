import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Divider,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";

import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

function App() {
  const [matrix, setMatrix] = useState([
    ["", ""],
    ["", ""],
  ]);

  const [det, setDet] = useState(null);
  const [steps, setSteps] = useState("");
  const [sizeElement, setSize] = useState(matrix.length);
  const [stepsFinally, setStepsFinally] = useState("");
  const isMobile = useMediaQuery("(max-width:700px)");
  const handleChange = (e, row, col) => {
    const newMatrix = [...matrix];
    newMatrix[row][col] = e.target.value;
    setMatrix(newMatrix);
  };

  const calculateDeterminant = (matrix) => {
    return calculateDeterminantGeneral(matrix);
  };

  const calculateDeterminantGeneral = (matrix) => {
    const size = matrix.length;

    if (size === 1) {
      return { det: matrix[0][0], steps: `${matrix[0][0]}` };
    }

    if (size === 2) {
      const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
      const steps = `(${matrix[0][0]}*${matrix[1][1]}) - (${matrix[0][1]}*${matrix[1][0]}) = ${det}`;
      return { det, steps };
    }

    let det = 0;
    let stepsArray = [];
    let reulta = "";
    for (let col = 0; col < size; col++) {
      const resul = resutlado(matrix);
      const subMatrix = matrix
        .slice(1)
        .map((row) => row.filter((_, c) => c !== col));

      const sign = col % 2 === 0 ? 1 : -1;
      const subDet = calculateDeterminantGeneral(subMatrix);

      const partialDet = sign * matrix[0][col] * subDet.det;
      const subMatrixString = subMatrix
        .map((row) => row.join(" & "))
        .join(" \\\\ ");

      reulta = resul.steps;
      stepsArray.push(
        `(${sign === 1 ? "" : "-"}${
          matrix[0][col]
        })\\begin{vmatrix} ${subMatrixString} \\end{vmatrix}  \\quad ${
          subDet.steps
        }`
      );
      det += partialDet;
    }
    const finalDet = det;
    let steps;

    if (stepsArray.length === sizeElement - 1) {
      steps =
        stepsArray.join(" \\\\ \\\\ ") +
        ` \\\\ \\text{Resultado de matriz: } ${reulta}`;
    } else {
      steps = stepsArray.join(" \\\\ \\\\ ");
    }

    return { det: finalDet, steps };
  };

  const resutlado = (matrix) => {
    const size = matrix.length;

    if (size === 1) {
      return { det: matrix[0][0], steps: `${matrix[0][0]}` };
    }

    if (size === 2) {
      const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
      const steps = `(${matrix[0][0]}*${matrix[1][1]}) - (${matrix[0][1]}*${matrix[1][0]}) = ${det}`;
      return { det, steps };
    }

    let det = 0;
    let stepsArray = [];
    let steps = "";
    for (let col = 0; col < size; col++) {
      const subMatrix = matrix
        .slice(1)
        .map((row) => row.filter((_, c) => c !== col));
      const sign = col % 2 === 0 ? 1 : -1;
      const subDet = calculateDeterminantGeneral(subMatrix);
      const partialDet = sign * matrix[0][col] * subDet.det;
      const subMatrixString = subMatrix
        .map((row) => row.join(" & "))
        .join(" \\\\ "); // Formato LaTeX
      stepsArray.push(
        `(${sign === 1 ? "" : "-"}${matrix[0][col]}*${subDet.det})`
      );
      det += partialDet;
    }

    const finalDet = det;
    steps = stepsArray.join(" + ") + ` = ${finalDet}`;
    return { det: finalDet, steps };
  };

  const handleCalculate = () => {
    const size = Math.min(matrix.length, matrix[0].length);
    let subMatrix = [];
    for (let i = 0; i < size; i++) {
      let row = [];
      for (let j = 0; j < size; j++) {
        if (matrix[i][j] === "")
          return setDet("Matriz incompleta, favor de completar la matriz");
        row.push(parseFloat(matrix[i][j]));
      }
      subMatrix.push(row);
    }

    try {
      const data = resutlado(subMatrix);
      setStepsFinally(data.steps);
      const { det, steps } = calculateDeterminant(subMatrix);
      setDet(det);
      setSteps(steps);
    } catch (error) {
      setDet("Matriz inválida");
    }
  };

  const nuevoFila = () => {
    const newMatrix = matrix.map((row) => [...row, ""]);
    newMatrix.push(new Array(newMatrix[0].length).fill(""));
    setSize(newMatrix.length);
    setMatrix(newMatrix);
  };

  const eliminarFila = () => {
    const newMatrix = matrix.slice(0, -1);
    const updatedMatrix = newMatrix.map((row) => row.slice(0, -1));
    setSize(newMatrix.length);
    setMatrix(updatedMatrix);
  };

  const limpiar = () => {
    setMatrix([
      ["", ""],
      ["", ""],
    ]);
    setDet(null);
    setSteps("");
    setStepsFinally("");
  };
  const latexString = 'C_{ij} = (-1)^{i+j} M_{ij}';

  return (
    <CssBaseline>
      <Container fixed>
        <Box>
          <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h5" sx={{ mt: 2 }}>
                Calculadora de Determinantes de Matrices
              </Typography>

              <Typography variant="h5" sx={{ mt: 2 }}>
                ¿Qué es una determinante?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Los determinantes son valores escalares que se asocian a
                matrices cuadradas, esto es, aquellas matrices en las que el
                número de filas es igual al número de columnas. El determinante
                de una matriz es una medida numérica que proporciona información
                importante sobre la matriz y sus transformaciones lineales
                asociadas.
              </Typography>
              
              <Typography variant="h5" sx={{ mt: 2 }}>
                ¿Qué es una adjunta?
              </Typography>
              <Typography variant="body2" color="text.secondary">
              Una adjunta se utiliza en el calculo de las determinantes, y tiene el mismo valos numerico que el menor pero puede tener un signo diferente
              se expresa como :<BlockMath math={latexString} />
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b style={{fontSize:"18px"}}>i </b>   es el indice de la fila.
              </Typography>
              <Typography variant="body2" color="text.secondary">
              <b style={{fontSize:"18px"}}>j </b>    es el indice de la columna.
              </Typography>
              <Typography variant="body2" color="text.secondary">
              <b style={{fontSize:"18px"}}>C</b><b style={{fontSize:"15px"}}>ij</b> es el adjunto correspondiente a la i-esima fila y a la j-esima columna.
              </Typography>
              <Typography variant="body2" color="text.secondary">
              <b style={{fontSize:"18px"}}>M</b><b style={{fontSize:"15px"}}>ij</b> es el menor correspondiente a la i-esima fila y a la j-esima columna.
              </Typography>

              <Container sx={{ mt: 2 }}>
                <Divider textAlign="left">
                  <Typography variant="h5">Introduzca la Matriz</Typography>
                </Divider>
                <div style={{  overflowX: isMobile ?"scroll" :""}}>
                <div style={{ width: isMobile ? "800px" :""}}>
                  {matrix.map((row, rowIndex) => (
                    <Grid
                      container
                      spacing={1}
                      sx={{
                        textAlign: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mt: 0.1,
                      
                      }}
                    >
                      {row.map((cell, colIndex) => (
                        <Grid
                          item
                          xs={ 1}
                          key={`${rowIndex}-${colIndex}`}
                        >
                          <TextField
                            autoComplete="off"
                            size="small"
                            label={`(i${rowIndex + 1},j${colIndex + 1})`}
                            value={cell}
                            onChange={(e) =>
                              handleChange(e, rowIndex, colIndex)
                            }
                            fullWidth
                          />
                        </Grid>
                      ))}
                    </Grid>
                  ))}
                        </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <Divider textAlign="left">
                      <Typography variant="h5">Tamaño</Typography>
                    </Divider>

                    <Button
                      variant="outlined"
                      startIcon={<AddOutlinedIcon />}
                      color="primary"
                      onClick={nuevoFila}
                      sx={{ mt: 2, mr: 2 }}
                    >
                      Agregar
                    </Button>
                    <Button
                      sx={{ mt: 2 }}
                      disabled={matrix.length === 2}
                      onClick={eliminarFila}
                      variant="outlined"
                      startIcon={<RemoveOutlinedIcon />}
                    >
                      Quitar
                    </Button>
                  </div>
                  <div style={{ flex: 2, textAlign: "right" }}></div>
                  <div style={{ flex: 1, textAlign: "right" }}>
                    <Divider textAlign="left">
                      <Typography variant="h5">Determinante</Typography>
                    </Divider>
                    <Button
                      sx={{ mt: 2, mr: 2 }}
                      variant="outlined"
                      color="primary"
                      onClick={limpiar}
                      startIcon={<BackspaceOutlinedIcon />}
                    >
                      Limpiar
                    </Button>
                    <Button
                      sx={{ mt: 2 }}
                      variant="outlined"
                      color="primary"
                      onClick={handleCalculate}
                      startIcon={<CalculateOutlinedIcon />}
                    >
                      Calcular
                    </Button>
                  </div>
                </div>
                <div style={{ display: det == null ? "none" : "" }}>
                  <Typography variant="h6" style={{ marginTop: "20px" }}>
                    Determinante de la matriz: {det}
                  </Typography>
                  <Typography variant="h5" style={{ marginTop: "20px" }}>
                    Pasos:
                  </Typography>
                  <Box sx={{ mt: 2, overflowX: "auto" }}>
                    {steps.split("\\\\ \\\\").map((step, index) => (
                      <BlockMath key={index}>{step}</BlockMath>
                    ))}
                  </Box>
                  <Box sx={{ mt: 2, overflowX: "auto" }}>
                    <Typography variant="h6">Resultado final</Typography>{" "}
                    <BlockMath>{stepsFinally}</BlockMath>
                  </Box>
                </div>
              </Container>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </CssBaseline>
  );
}

export default App;
