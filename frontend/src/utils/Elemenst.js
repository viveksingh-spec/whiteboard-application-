import rough from "roughjs/bundled/rough.esm";
import { ARROW_LENGTH, TOOL_ITEMS } from "../constants";
import { getArrowHeadsCoordinates ,isPointCloseToLine} from "./math";
import getStroke from "perfect-freehand";
const gen = rough.generator();

const GenRoughElements = (id, x1, y1, x2, y2, { type,stroke,fill,size}) => {

  const options = {
    seed: id + 1,
    fillStyle:"solid"
  };



  if(stroke){
      options.stroke = stroke
  }

  if(fill){
    options.fill = fill
  }

  if(size){
    options.strokeWidth = size
  }

  switch (type) {
    case TOOL_ITEMS.LINE:
      const ele = {
        id,
        x1,
        y1,
        x2,
        y2,
        type,
        roughEle: gen.line(x1, y1, x2, y2, options),
      }
      return ele

    case TOOL_ITEMS.RECTANGLE:
      return {
        id,
        x1,
        y1,
        x2,
        y2,
        type,
        roughEle: gen.rectangle(
          x1,
          y1,
          x2 - x1,
          y2 - y1,
          options
        ),
      };
      case TOOL_ITEMS.CIRCLE:
        const cx = (x1+x2)/2
        const cy = (y1+y2)/2
        return{
            id,
            x1,
            y1,
            x2,
            y2,
            type,
            roughEle : gen.ellipse(cx,cy,x2-x1,y2-y1,options),
        };

      case TOOL_ITEMS.ARROW:
      const {x3,y3,x4,y4} = getArrowHeadsCoordinates(x1,y1,x2,y2,ARROW_LENGTH)
      const points = [
           [x1,y1],
           [x2,y2],
           [x3,y3],
           [x2,y2],
           [x4,y4]
      ]
        return {
            id,
            x1,
            y1,
            x2,
            y2,
            type,
            roughEle:gen.linearPath(points,options)
        }

        case TOOL_ITEMS.BRUSH:
         {
           const brushelement = {
              id,
              points : [{x:x1,y:y1}],
              path: new Path2D(getSvgPathFromStroke(getStroke([{x:x1,y:y1}]))),
              type,
              stroke,
              size
           }
           return brushelement
         }
        case TOOL_ITEMS.TEXT:
          return {
            id,
            x1,
            y1,
            x2,
            y2,
            stroke,
            size,
            type,
            text:""
        }
    default:
      throw new Error(`Unknown tool type: ${type}`);
  }
};

export const getSvgPathFromStroke = (stroke) => {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
};

export const EraseElements = (element, pointX, pointY) => {
  if (!element || typeof element !== "object") return false;
  const { x1, y1, x2, y2, type } = element;
  if (!type) return false;
  const context = document.getElementById("canvas").getContext("2d");
  switch (type) {
    case TOOL_ITEMS.LINE:
    case TOOL_ITEMS.ARROW:
      return isPointCloseToLine(x1, y1, x2, y2, pointX, pointY);
    case TOOL_ITEMS.RECTANGLE:
    case TOOL_ITEMS.CIRCLE:
      return (
        isPointCloseToLine(x1, y1, x2, y1, pointX, pointY) ||
        isPointCloseToLine(x2, y1, x2, y2, pointX, pointY) ||
        isPointCloseToLine(x2, y2, x1, y2, pointX, pointY) ||
        isPointCloseToLine(x1, y2, x1, y1, pointX, pointY)
      );
    case TOOL_ITEMS.BRUSH:
      const elPath = new Path2D(getSvgPathFromStroke(getStroke(element.points)));
      return context.isPointInPath(elPath, pointX, pointY);
    case TOOL_ITEMS.TEXT:
      context.font = `${element.size}px Caveat`;
      context.fillStyle = element.stroke;
      const textWidth = context.measureText(element.text).width;
      const textHeight = parseInt(element.size);
      context.restore();
      return (
        isPointCloseToLine(x1, y1, x1 + textWidth, y1, pointX, pointY) ||
        isPointCloseToLine(
          x1 + textWidth,
          y1,
          x1 + textWidth,
          y1 + textHeight,
          pointX,
          pointY
        ) ||
        isPointCloseToLine(
          x1 + textWidth,
          y1 + textHeight,
          x1,
          y1 + textHeight,
          pointX,
          pointY
        ) ||
        isPointCloseToLine(x1, y1 + textHeight, x1, y1, pointX, pointY)
      );
    default:
      return false;
  }
};

export default GenRoughElements;
