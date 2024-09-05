/*
 * @Description: 绘制线段
 * @Author: ldx
 * @Date: 2023-12-09 10:21:06
 * @LastEditors: ldx
 * @LastEditTime: 2024-09-05 15:12:05
 */
import { v4 } from 'uuid'
import { EditorView } from '@/editor/view'
import ToolBase from './toolBase'
import {  DragEvent, Line } from 'leafer-editor'
export default class ToolDrawLine extends ToolBase {
  readonly keyboard = 'l'
  readonly type = 'drawLine'
  line!: Line
  constructor(view: EditorView) {
    super(view)
  }
 
  start = (e: DragEvent) => {
    const { x, y } = this.app.getPagePoint({x:e.x,y:e.y})
    this.line = new Line({
      editable: true,
      strokeWidth: 2,
      stroke: '#ff0000',
      points: [x, y],
      name:'线段',
      id:v4()
    })
    this.app.tree.add(this.line)
  }

  drag = (e: DragEvent) => {
    if (this.line) {
      const { x, y } = this.app.getPagePoint({x:e.x,y:e.y})
      const points = (this.line.points||[]).splice(0, 2,)
      this.line.points = [...points, x, y]
    }
  }
  end = () =>{
    this.app.tree.emit('add')
  }
 
  active() {
    this.app.editor.visible = false
    this.app.tree.hitChildren = false
    this.app.on(DragEvent.START, this.start)
    this.app.on(DragEvent.DRAG, this.drag)
    this.app.on(DragEvent.END, this.end)
  }
  inactive() {
    this.app.editor.visible = true
    this.app.tree.hitChildren = true
    this.app.off(DragEvent.START, this.start)
    this.app.off(DragEvent.DRAG, this.drag)
    this.app.on(DragEvent.END, this.end)
  }

}

