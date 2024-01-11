import React, { useState } from 'react';
import classes from "./Board_main.module.css"
import { SketchPicker } from 'react-color';

const Createboard = (props) => {
    const [boardTitle, setBoardTitle] = useState('');
    const [visibility, setVisibility] = useState('');
    const [color, setColor] = useState('#ffffff'); // 초기 색상 설정

    const handleChange = (newColor) => {
        setColor(newColor.hex);
    };

    const handleSubmit = () => {
        props.click()
        console.log(boardTitle, visibility, color)
        fetch("http://localhost:4000/board", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", "Authorization": `Bearer ${sessionStorage.getItem("access_token")}`
            },
            body: JSON.stringify({ name: boardTitle, description: visibility, color: color })
        }).then(res => res.json()).then(resData => {window.location.reload();}).catch(err => console.log(err))

    };

    return (
        <div className={classes.create}>
            <label className={classes.label}>
                Board title
                <input type="text" value={boardTitle} onChange={(e) => setBoardTitle(e.target.value)} required />
            </label>

            <label>description</label>
            <input type="text" value={visibility} onChange={(e) => setVisibility(e.target.value)} required />

            <div style={{ marginLeft: "5%" }}>
                <SketchPicker color={color} onChange={handleChange} />
            </div>

            <button type="button" disabled={!boardTitle || !visibility} onClick={handleSubmit}>Create</button>
        </div>
    );
};

export default Createboard;
