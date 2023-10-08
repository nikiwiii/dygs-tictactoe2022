import { Component } from '@angular/core'
import { __classPrivateFieldSet } from 'tslib'


window.onload = () => {
  document.getElementById('myVideo')!.style.background = 'linear-gradient(34deg, #F0C27B, #4B1248)'
};

interface minmaxMove {
  index?:number
  score?:number
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent {
  title = 'tictactoe'
  public el = document.querySelector.bind(document)
  public human!:string
  public ai!:string
  public GTurn:boolean = true
  public check:string = 'continue'
  public board!:Array<string|number>
  public shift:number = 1
  /*   public win:boolean = false
  public lost:boolean = false
  public draw:boolean = false
  public moves:number */

  public over(id:number) {
    if(this.el(`.f${id}`)!.innerHTML == ''){
      this.el(`.f${id}`)!.setAttribute('hov', '')
      this.el(`.f${id}`)!.innerHTML = this.human
    }
  }

  public notOver(id:number) {
    if(this.el(`.f${id}`)!.hasAttribute('hov')){
      this.el(`.f${id}`)!.innerHTML = ''
      this.el(`.f${id}`)!.removeAttribute('hov')
    }
  }

  public chooseSign(id:string){
    this.human = id
    this.AI()
    this.start()
  }

  private AI() {
    if(this.human == 'X'){
      this.ai = 'O'
    }
    else {
      this.ai = 'X'
    }
  }

  public start() {
    if(!this.el('.endOfGame')!.classList.contains('disabled')){
      this.el('.endOfGame')!.classList.add('disabled')
      this.el('.game #restart')!.classList.remove('disabled')
    }
    this.board = Array(9)
    for (var i = 0; i < this.board.length; i++) {
      this.board[i] = i// indexy jako zawartosc
      this.el(`.f${i}`)!.classList.add('emt')
      this.el(`.f${i}`)!.innerHTML = ''
    }
    this.check = 'continue'
    this.GTurn = true
    this.el('.enter')!.classList.add('disabled')
    this.el('.game')!.classList.remove('disabled')
  }

  public initMove(id:number) {
    if(this.el(`.f${id}`)!.hasAttribute('hov')){
      this.el(`.f${id}`)!.removeAttribute('hov')
      this.el(`.f${id}`)!.classList.remove('emt')
    }
    this.move(id)
  }

  get turn() {
    return this.GTurn ? this.human : this.ai
  }

  public move(id:number) {
    if (this.board[id] != 'X' && this.board[id] != 'O' && this.check == 'continue') {
      this.board.splice(id, 1, this.turn)
      this.check = this.checkWinDraw(this.board)
      this.GTurn = !this.GTurn// zmien gracza
      if (this.turn == this.ai){
        this.AIMove()
      }
      this.update()
      this.finito()
    }
  }

  private AIMove() {
    const bestMove:minmaxMove = this.minimax(this.board, 0, true)
    console.log(bestMove)
    this.move(bestMove.index!)
  }

  private update() {
    var j:number = 0
    this.board.forEach(i => {
      if(this.el(`.f${j}`)!.innerHTML != i && typeof i != 'number'){
        this.el(`.f${j}`)!.classList.remove('emt')
        this.el(`.f${j}`)!.innerHTML = String(i)
      }
      j++
    })
  }  

  private checkWinDraw(board:Array<string|number>) {
    const lines = [
      [0, 1, 2],//poz v
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],//pion v
      [1, 4, 7],
      [2, 4, 6],
      [2, 5, 8],//skos v
      [0, 4, 8],
    ]
    for (var i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        if (board[a] == this.ai) {
          return 'cWin'
        } 
        else if (board[a] == this.human) {
          return 'pWin'
        }
      }
    }
    if (this.board.every((v) => typeof v != 'number')) {
      return 'draw'
    }
    return 'continue'
  }

  private getEmptyFields(board:Array<string|number>) {
    const arr:Array<number> = board.filter((e) => typeof e == 'number') as Array<number>
    //tablica indexow pustych pol
    return arr
  }

  private minimax(board:Array<string|number>, depth:number, maxingAI:boolean) {
    const gameState = this.checkWinDraw(board)

    if (gameState != 'continue') {
      if (gameState == 'cWin') {
        var tmp:minmaxMove = { score: 10 - depth }
        return tmp
      } else if (gameState == 'pWin') {
        var tmp:minmaxMove = { score: -10 + depth }
        return tmp
      } else if (gameState == 'draw') {
        var tmp:minmaxMove = { score: 0 }
        return tmp
      }
    }

    const emptyFields = this.getEmptyFields(board)

    if (maxingAI) {//ai walczy
      var bestMove:minmaxMove = { score: -1000 }
      for (const empFld of emptyFields) {
        board[empFld] = this.ai
        var Move = this.minimax(board, depth + 1, !maxingAI)//zrob scenariusz
        Move.index = empFld
        board[empFld] = empFld
        if (Move.score! > bestMove.score!) bestMove = Move
      }
      return bestMove
    } 

    else {
      var bestMove:minmaxMove = { score: 1000 }
      for (const empFld of emptyFields) {
        board[empFld] = this.human
        var Move = this.minimax(board, depth + 1, !maxingAI)
        Move.index = empFld
        board[empFld] = empFld
        if (Move.score! < bestMove.score!) bestMove = Move
      }
      return bestMove
    }
  }

  public backgr() {
    this.el('video')!.style.opacity = '0'
    setTimeout(() => {  
      this.el('video')!.classList.remove(`gr${this.shift}`)
      this.shift++
      if(this.shift > 10){
        this.shift = 1
      }
      this.el('video')!.classList.add(`gr${this.shift}`)
    }, 800)
    setTimeout(() => this.el('video')!.style.opacity = '100%', 800)
  }

  private finito() {
    if(this.checkWinDraw(this.board) != 'continue'){
      this.el('.endOfGame')!.classList.remove('disabled')
      this.el('.game #restart')!.classList.add('disabled')
      if(this.checkWinDraw(this.board) == 'cWin'){
        this.el('.endOfGame p')!.innerHTML = 'you lost!'
      }  
      else if(this.checkWinDraw(this.board) == 'draw'){
        this.el('.endOfGame p')!.innerHTML = 'draw!'
      }
    }  
  }
}