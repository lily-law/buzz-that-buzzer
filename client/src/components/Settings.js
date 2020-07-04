import React, {useState} from 'react';
import './Settings.css';
import cancelIcon from '../images/cancel.svg';
import settingsIcon from '../images/settings.svg';
import doneIcon from '../images/done.svg';
import mutedIcon from '../images/muted.svg';
import unmutedIcon from '../images/unmuted.svg';

export default function Settings({userData, updateUserData, close, sessionSocket}) {
    const [colour, setColour] = useState(userData.colour || '');
    const [muted, setMuted] = useState(userData.muted || false);

    const submit = () => {
        updateUserData({
            muted,
            colour
        }, false, sessionSocket);
        close();
    }
    return (
        <dialog className="settings" open>
            <header className="settings__header">
                <button onClick={close}><img className="settings__close-icon" src={cancelIcon} alt="Cancel" /></button>
                <h1><img className="settings__title-icon" src={settingsIcon} alt="Settings" /></h1>
                <button onClick={submit}><img className="settings__done-icon" src={doneIcon} alt="Done" /></button>
            </header>
            <section className="settings__colours">
                <h2 className="settings__colours__title">{userData.name}'s colour</h2>
                <input className="settings__colours__input" type="color" value={colour} onChange={e => setColour(e.target.value)} />
            </section>
            <section className="settings__sounds">
                <div className="sounds__toggle">
                    <button onClick={() => setMuted(true)} className={`toggle__mute-button ${muted ? 'active' : 'inactive'}`}><img src={mutedIcon} alt="muted" /></button>
                    <button onClick={() => setMuted(false)} className={`toggle__mute-button ${!muted ? 'active' : 'inactive'}`}><img src={unmutedIcon} alt="unmuted" /></button>
                </div>
                <div className="sounds__options">
                    {muted ? 
                        <h2>Sound is muted!</h2> :
                        <div>
                            
                        </div>
                    }
                </div>
            </section>
        </dialog>
    )
}