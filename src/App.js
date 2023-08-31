import React, { useState, useEffect } from "react";
import "./App.css";

import { MediaStreamComposer } from "@api.video/media-stream-composer";
import { Button } from "@mui/material";

const App = () => {
	const [composer, setComposer] = useState(null);
	const [videoLink, setVideoLink] = useState("");
	const [enableScreenCapture, setEnableScreenCapture] = useState(false);

	useEffect(() => {
		setComposer(
			new MediaStreamComposer({
				resolution: {
					width: 1920,
					height: 1080,
				},
			})
		);
	}, []);

	const onStart = () => {
		composer.startRecording({
			uploadToken: "w9Rn50lnxRsRMIcAQYVGXTG7Gm6NGFEqqDUMdWVE5xH",
		});
	};

	const onStop = () => {
		composer.stopRecording().then((a) => {
			setVideoLink(a.assets.player);
		});
	};

	useEffect(() => {
		if (enableScreenCapture)
			(async () => {
				const composer = new MediaStreamComposer({
					resolution: {
						width: 1920,
						height: 1080,
					},
				});

				composer.appendCanvasTo("#canvas-container"); // append the canvas to the DOM
				const screencast = await navigator.mediaDevices.getDisplayMedia(); // retrieve the screencast stream
				const webcam = await navigator.mediaDevices.getUserMedia({
					// retrieve the webcam stream
					audio: true,
					video: true,
				});

				composer.addStream(screencast, {
					position: "contain", // we want the screencast to be displayed in the center of the canvas and to occupy as much space as possible
					mute: true, // we don't want to hear the screencast stream
				});

				// add the webcam stream in the lower left corner, with a circle mask
				composer.addStream(webcam, {
					position: "fixed", // we want the webcam to be displayed in a specific position on the canvas
					mute: false, // we want to hear the webcam stream
					y: 0, // we want the webcam to be displayed in the lower part of the canvas
					left: 0, // we want the webcam to be displayed in the left corner of the canvas
					height: 200, // we want the webcam to be displayed in a 200px height
					mask: "circle", // we want the webcam to be displayed with a circle mask
					draggable: true, // we want the webcam to be draggable by the user
					resizable: true, // we want the webcam to be resizable by the user
				});
			})();
	}, [enableScreenCapture]);

	return (
		<div className="App">
			<header className="App-header">
				<Button onClick={onStart}>Start Recording</Button>
				<Button onClick={onStop}>End Recording</Button>
				<Button
					onClick={() => {
						setEnableScreenCapture(!enableScreenCapture);
					}}
				>
					Enable Screen Capture
				</Button>
				<div id="container">
					<div id="canvas-container"></div>preview here
				</div>
				<div>
					<p style={{ fontSize: "14px" }}>
						Video link: {videoLink}
						<span id="video-link">
							<i>will be displayed when the recording is finished</i>
						</span>
					</p>
				</div>
			</header>
		</div>
	);
};

export default App;
