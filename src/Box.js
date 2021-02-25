import './Board.css';

function Box(props) {
    const {key, onclick, mark} = props

    return <div key={key} onClick={onclick} className="box">{mark}</div>
}

export default Box
