import React from 'react'

function Audio({file}) {
    return (
        <audio controls>
            <source src={file} type="audio/mpeg" />
            Your browser does not support the audio element.
        </audio>

    )
}

export default Audio
