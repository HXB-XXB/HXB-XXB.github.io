(() => {
    const isFilePage = Boolean(document.getElementById('project-iframe'));
    const mobileQuery = window.matchMedia('(max-width: 720px)');

    document.body.classList.add(isFilePage ? 'mobile-file-page' : 'mobile-home-page');

    const mobileStyles = document.createElement('link');
    mobileStyles.rel = 'stylesheet';
    mobileStyles.href = 'css_mobile/mobile.css';
    document.head.appendChild(mobileStyles);

    if (!isFilePage) {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            const focus = searchInput.focus.bind(searchInput);
            searchInput.focus = (...args) => {
                if (!mobileQuery.matches) {
                    focus(...args);
                }
            };
        }
        return;
    }

    const keyboardButton = document.getElementById('keyboard-button');
    if (keyboardButton) {
        keyboardButton.hidden = true;
    }

    const keyCodes = {
        Escape: { key: 'Escape', code: 'Escape', keyCode: 27 },
        Tab: { key: 'Tab', code: 'Tab', keyCode: 9 },
        Enter: { key: 'Enter', code: 'Enter', keyCode: 13 },
        Backspace: { key: 'Backspace', code: 'Backspace', keyCode: 8 },
        Space: { key: ' ', code: 'Space', keyCode: 32, label: 'Space' },
        Shift: { key: 'Shift', code: 'ShiftLeft', keyCode: 16 },
        Ctrl: { key: 'Control', code: 'ControlLeft', keyCode: 17 },
        Alt: { key: 'Alt', code: 'AltLeft', keyCode: 18 },
        ArrowLeft: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37, label: '←' },
        ArrowUp: { key: 'ArrowUp', code: 'ArrowUp', keyCode: 38, label: '↑' },
        ArrowRight: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39, label: '→' },
        ArrowDown: { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40, label: '↓' }
    };
    const punctuationCodes = {
        ';': ['Semicolon', 186, ':'],
        "'": ['Quote', 222, '"'],
        ',': ['Comma', 188, '<'],
        '.': ['Period', 190, '>'],
        '/': ['Slash', 191, '?'],
        '[': ['BracketLeft', 219, '{'],
        ']': ['BracketRight', 221, '}'],
        '-': ['Minus', 189, '_'],
        '=': ['Equal', 187, '+'],
        '\\': ['Backslash', 220, '|'],
        '`': ['Backquote', 192, '~']
    };

    function getKeyEventData(keyName, shifted) {
        if (keyCodes[keyName]) {
            return keyCodes[keyName];
        }
        if (/^[A-Z]$/.test(keyName)) {
            const letter = shifted ? keyName : keyName.toLowerCase();
            return { key: letter, code: `Key${keyName}`, keyCode: keyName.charCodeAt(0) };
        }
        if (/^[0-9]$/.test(keyName)) {
            const shiftedDigits = ')!@#$%^&*(';
            const key = shifted ? shiftedDigits[Number(keyName)] : keyName;
            return { key, code: `Digit${keyName}`, keyCode: keyName.charCodeAt(0) };
        }
        if (punctuationCodes[keyName]) {
            const [code, keyCode, shiftedKey] = punctuationCodes[keyName];
            return { key: shifted ? shiftedKey : keyName, code, keyCode };
        }
        return null;
    }

    function getDisplayLabel(keyName) {
        return keyCodes[keyName]?.label || keyName;
    }

    function getProject() {
        const projectKey = new URLSearchParams(window.location.search).get('project') || 'portal';
        return typeof PROJECTS !== 'undefined' && Array.isArray(PROJECTS)
            ? PROJECTS.find((project) => project.key === projectKey)
            : null;
    }

    function createKeyboard(frame, project) {
        if (!mobileQuery.matches || !Array.isArray(project.mobileKeys)) {
            return;
        }
        if (project.mobileKeys.some((row) =>
            !Array.isArray(row) || row.some((key) => typeof key !== 'string' || !getKeyEventData(key, false))
        )) {
            console.error(`Invalid mobileKeys configuration for project "${project.key}".`);
            return;
        }

        const player = document.getElementById('project-iframe');
        if (!player || player.querySelector('#mobile-keyboard')) {
            return;
        }

        const lockableKeys = new Set(
            Array.isArray(project.mobileLockKeys)
                ? project.mobileLockKeys
                : Array.isArray(project.mobileToggleKeys) ? project.mobileToggleKeys : []
        );
        const lockedKeys = new Set();
        const pressedKeys = new Set();
        const activeSources = new Map();
        const activePointers = new Map();
        const joystickThumbs = [];
        const keyboard = document.createElement('div');
        keyboard.id = 'mobile-keyboard';
        keyboard.setAttribute('role', 'group');
        const language = typeof getCurrentLang === 'function' ? getCurrentLang() : 'en';
        keyboard.setAttribute('aria-label', language === 'zh' ? '虚拟键盘' : 'Virtual keyboard');

        function dispatchKeyEvent(type, keyName) {
            const win = frame.contentWindow;
            const doc = frame.contentDocument;
            if (!win || !doc) {
                console.error('Unable to access the project frame for virtual keyboard input.');
                return;
            }

            const shifted = pressedKeys.has('Shift');
            const data = getKeyEventData(keyName, shifted);
            if (!data) {
                console.error(`Unsupported virtual key "${keyName}".`);
                return;
            }

            const event = new win.KeyboardEvent(type, {
                key: data.key,
                code: data.code,
                bubbles: true,
                cancelable: true,
                shiftKey: shifted,
                ctrlKey: pressedKeys.has('Ctrl'),
                altKey: pressedKeys.has('Alt')
            });
            for (const property of ['keyCode', 'which']) {
                Object.defineProperty(event, property, { get: () => data.keyCode });
            }
            (doc.activeElement || doc).dispatchEvent(event);
        }

        function setKeySource(source, keyName, isPressed) {
            const sources = activeSources.get(keyName) || new Set();
            if (isPressed) {
                if (sources.has(source)) {
                    return;
                }
                sources.add(source);
                activeSources.set(keyName, sources);
                if (sources.size === 1) {
                    pressedKeys.add(keyName);
                    dispatchKeyEvent('keydown', keyName);
                }
                return;
            }

            if (!sources.delete(source)) {
                return;
            }
            if (sources.size === 0) {
                activeSources.delete(keyName);
                if (pressedKeys.delete(keyName)) {
                    dispatchKeyEvent('keyup', keyName);
                }
            }
        }

        function toggleLockedKey(keyName) {
            if (lockedKeys.has(keyName)) {
                lockedKeys.delete(keyName);
                setKeySource(`lock:${keyName}`, keyName, false);
            } else {
                lockedKeys.add(keyName);
                setKeySource(`lock:${keyName}`, keyName, true);
            }
            setKeyButtonsPressed(keyName, lockedKeys.has(keyName));
        }

        function setKeyButtonsPressed(keyName, isPressed) {
            keyboard.querySelectorAll('.mobile-key').forEach((button) => {
                if (button.dataset.key === keyName) {
                    button.classList.toggle('is-pressed', isPressed);
                    button.setAttribute('aria-pressed', String(isPressed));
                }
            });
        }

        function releaseAllKeys() {
            for (const keyName of [...pressedKeys]) {
                dispatchKeyEvent('keyup', keyName);
            }
            pressedKeys.clear();
            activeSources.clear();
            activePointers.clear();
            lockedKeys.clear();
            joystickInputs.clear();
            keyboard.querySelectorAll('.is-pressed').forEach((button) => {
                button.classList.remove('is-pressed');
                button.setAttribute('aria-pressed', 'false');
            });
            joystickThumbs.forEach((thumb) => {
                thumb.style.setProperty('--stick-x', '0px');
                thumb.style.setProperty('--stick-y', '0px');
            });
        }

        const joystickInputs = new Map();

        project.mobileKeys.forEach((row) => {
            const rowElement = document.createElement('div');
            rowElement.className = 'mobile-key-row';
            row.forEach((keyName) => {
                const button = document.createElement('button');
                button.className = 'mobile-key';
                button.type = 'button';
                button.dataset.key = keyName;
                button.textContent = getDisplayLabel(keyName);
                button.setAttribute('aria-label', keyName);
                button.setAttribute('aria-pressed', 'false');
                if (lockableKeys.has(keyName)) {
                    button.classList.add('is-lockable');
                    button.title = language === 'zh'
                        ? '点击锁定，再次点击松开'
                        : 'Tap to lock; tap again to release';
                }

                button.addEventListener('pointerdown', (event) => {
                    event.preventDefault();
                    if (activePointers.has(event.pointerId)) {
                        return;
                    }
                    activePointers.set(event.pointerId, { keyName, button });
                    if (typeof button.setPointerCapture === 'function') {
                        button.setPointerCapture(event.pointerId);
                    }
                    if (lockableKeys.has(keyName)) {
                        toggleLockedKey(keyName);
                    } else {
                        setKeyButtonsPressed(keyName, true);
                        setKeySource(`pointer:${event.pointerId}`, keyName, true);
                    }
                });

                const releasePointer = (event) => {
                    const active = activePointers.get(event.pointerId);
                    if (!active) {
                        return;
                    }
                    activePointers.delete(event.pointerId);
                    if (!lockableKeys.has(keyName)) {
                        setKeySource(`pointer:${event.pointerId}`, keyName, false);
                        setKeyButtonsPressed(keyName, Boolean(activeSources.get(keyName)?.size) || lockedKeys.has(keyName));
                    }
                };
                button.addEventListener('pointerup', releasePointer);
                button.addEventListener('pointercancel', releasePointer);
                button.addEventListener('lostpointercapture', releasePointer);
                rowElement.appendChild(button);
            });
            keyboard.appendChild(rowElement);
        });

        const controls = project.mobileControls || {};
        for (const controlType of ['joystick', 'arrowJoystick', 'dpad']) {
            const control = controls[controlType];
            if (control && (typeof control !== 'object' || Array.isArray(control) ||
                Object.values(control).some((keyName) =>
                    typeof keyName !== 'string' || !getKeyEventData(keyName, false)
                ))) {
                console.error(`Invalid mobileControls.${controlType} configuration for project "${project.key}".`);
                return;
            }
        }
        if (controls.vertical && (typeof controls.vertical !== 'object' ||
            Array.isArray(controls.vertical) ||
            Object.values(controls.vertical).some((keyName) =>
                typeof keyName !== 'string' || !getKeyEventData(keyName, false)
            ))) {
            console.error(`Invalid mobileControls.vertical configuration for project "${project.key}".`);
            return;
        }

        const joystickDefinitions = [
            ['joystick', controls.joystick, language === 'zh' ? 'WASD 摇杆' : 'WASD joystick', 'img/move.svg'],
            ['arrow-joystick', controls.arrowJoystick, language === 'zh' ? '方向键摇杆' : 'Arrow-key joystick', 'img/eye.svg']
        ].filter(([, mapping]) => mapping && typeof mapping === 'object' &&
            !Array.isArray(mapping) &&
            ['up', 'down', 'left', 'right'].some((direction) => typeof mapping[direction] === 'string')
        );
        const dpadDirections = ['up', 'left', 'down', 'right']
            .filter((direction) => typeof controls.dpad?.[direction] === 'string' &&
                getKeyEventData(controls.dpad[direction], false));
        const verticalDirections = ['up', 'down']
            .filter((direction) => typeof controls.vertical?.[direction] === 'string' &&
                getKeyEventData(controls.vertical[direction], false));
        const hasDpad = dpadDirections.length > 0;
        const hasVerticalButtons = verticalDirections.length > 0;
        if (joystickDefinitions.length || hasDpad || hasVerticalButtons) {
            const controlRow = document.createElement('div');
            controlRow.className = 'mobile-control-row';

            joystickDefinitions.forEach(([controlName, mapping, label, iconPath]) => {
                const joystick = document.createElement('div');
                joystick.className = `mobile-joystick mobile-${controlName}`;
                joystick.setAttribute('role', 'group');
                joystick.setAttribute('aria-label', label);
                const thumb = document.createElement('div');
                thumb.className = 'mobile-joystick-thumb';
                const icon = document.createElement('img');
                icon.className = 'mobile-joystick-icon';
                icon.src = iconPath;
                icon.alt = '';
                icon.setAttribute('aria-hidden', 'true');
                thumb.appendChild(icon);
                joystick.appendChild(thumb);
                joystickThumbs.push(thumb);

                const setJoystickDirection = (pointerId, event) => {
                    const rect = joystick.getBoundingClientRect();
                    const radius = Math.max(1, Math.min(rect.width, rect.height) / 2);
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    let dx = event.clientX - centerX;
                    let dy = event.clientY - centerY;
                    const distance = Math.hypot(dx, dy);
                    const maxDistance = radius * 0.72;
                    if (distance > maxDistance) {
                        dx = dx / distance * maxDistance;
                        dy = dy / distance * maxDistance;
                    }
                    thumb.style.setProperty('--stick-x', `${dx}px`);
                    thumb.style.setProperty('--stick-y', `${dy}px`);

                    const deadZone = radius * 0.28;
                    const nextKeys = new Set();
                    if (Math.hypot(dx, dy) >= deadZone) {
                        if (Math.abs(dx) >= deadZone * 0.7) {
                            const keyName = dx < 0 ? mapping.left : mapping.right;
                            if (keyName) nextKeys.add(keyName);
                        }
                        if (Math.abs(dy) >= deadZone * 0.7) {
                            const keyName = dy < 0 ? mapping.up : mapping.down;
                            if (keyName) nextKeys.add(keyName);
                        }
                    }
                    const previousKeys = joystickInputs.get(pointerId) || new Set();
                    for (const keyName of previousKeys) {
                        if (!nextKeys.has(keyName)) {
                            setKeySource(`joystick:${pointerId}`, keyName, false);
                        }
                    }
                    for (const keyName of nextKeys) {
                        if (!previousKeys.has(keyName)) {
                            setKeySource(`joystick:${pointerId}`, keyName, true);
                        }
                    }
                    joystickInputs.set(pointerId, nextKeys);
                };

                const releaseJoystick = (event) => {
                    const keys = joystickInputs.get(event.pointerId);
                    if (!keys) {
                        return;
                    }
                    for (const keyName of keys) {
                        setKeySource(`joystick:${event.pointerId}`, keyName, false);
                    }
                    joystickInputs.delete(event.pointerId);
                    thumb.style.setProperty('--stick-x', '0px');
                    thumb.style.setProperty('--stick-y', '0px');
                };

                joystick.addEventListener('pointerdown', (event) => {
                    event.preventDefault();
                    if (joystickInputs.has(event.pointerId)) {
                        return;
                    }
                    if (typeof joystick.setPointerCapture === 'function') {
                        joystick.setPointerCapture(event.pointerId);
                    }
                    setJoystickDirection(event.pointerId, event);
                });
                joystick.addEventListener('pointermove', (event) => {
                    if (joystickInputs.has(event.pointerId)) {
                        event.preventDefault();
                        setJoystickDirection(event.pointerId, event);
                    }
                });
                joystick.addEventListener('pointerup', releaseJoystick);
                joystick.addEventListener('pointercancel', releaseJoystick);
                joystick.addEventListener('lostpointercapture', releaseJoystick);
                controlRow.appendChild(joystick);
            });

            if (hasDpad) {
                const dpad = document.createElement('div');
                dpad.className = 'mobile-dpad';
                dpad.setAttribute('role', 'group');
                dpad.setAttribute('aria-label', language === 'zh' ? '方向键' : 'Directional pad');
                const directions = [
                    ['up', '↑'],
                    ['left', '←'],
                    ['down', '↓'],
                    ['right', '→']
                ].filter(([direction]) => dpadDirections.includes(direction));
                directions.forEach(([direction, label]) => {
                    const keyName = controls.dpad[direction];
                    const button = document.createElement('button');
                    button.className = 'mobile-key mobile-dpad-key';
                    button.type = 'button';
                    button.dataset.key = keyName;
                    button.dataset.direction = direction;
                    button.textContent = label;
                    button.setAttribute('aria-label', keyName);
                    button.setAttribute('aria-pressed', 'false');
                    button.addEventListener('pointerdown', (event) => {
                        event.preventDefault();
                        activePointers.set(event.pointerId, { keyName, button });
                        if (typeof button.setPointerCapture === 'function') {
                            button.setPointerCapture(event.pointerId);
                        }
                        setKeyButtonsPressed(keyName, true);
                        setKeySource(`pointer:${event.pointerId}`, keyName, true);
                    });
                    const releaseDpadKey = (event) => {
                        if (!activePointers.has(event.pointerId)) {
                            return;
                        }
                        activePointers.delete(event.pointerId);
                        setKeySource(`pointer:${event.pointerId}`, keyName, false);
                        setKeyButtonsPressed(keyName, Boolean(activeSources.get(keyName)?.size) || lockedKeys.has(keyName));
                    };
                    button.addEventListener('pointerup', releaseDpadKey);
                    button.addEventListener('pointercancel', releaseDpadKey);
                    button.addEventListener('lostpointercapture', releaseDpadKey);
                    dpad.appendChild(button);
                });
                controlRow.appendChild(dpad);
            }
            if (hasVerticalButtons) {
                const verticalButtons = document.createElement('div');
                verticalButtons.className = 'mobile-vertical-buttons';
                verticalButtons.setAttribute('role', 'group');
                verticalButtons.setAttribute(
                    'aria-label',
                    getLang().verticalMovement
                );
                const updateVerticalButtonLabels = () => {
                    verticalButtons.setAttribute('aria-label', getLang().verticalMovement);
                    verticalButtons.querySelectorAll('.mobile-vertical-key').forEach((button) => {
                        const label = getLang()[button.dataset.direction === 'up' ? 'rise' : 'descend'];
                        button.textContent = label;
                        button.setAttribute('aria-label', `${label} (${getDisplayLabel(button.dataset.key)})`);
                    });
                };
                [
                    ['up', getLang().rise],
                    ['down', getLang().descend]
                ].filter(([direction]) => verticalDirections.includes(direction))
                    .forEach(([direction, label]) => {
                        const keyName = controls.vertical[direction];
                        const button = document.createElement('button');
                        button.className = 'mobile-key mobile-vertical-key';
                        button.type = 'button';
                        button.dataset.key = keyName;
                        button.dataset.direction = direction;
                        button.textContent = label;
                        button.setAttribute('aria-label', `${label} (${getDisplayLabel(keyName)})`);
                        button.setAttribute('aria-pressed', 'false');
                        button.addEventListener('pointerdown', (event) => {
                            event.preventDefault();
                            activePointers.set(event.pointerId, { keyName, button });
                            if (typeof button.setPointerCapture === 'function') {
                                button.setPointerCapture(event.pointerId);
                            }
                            setKeyButtonsPressed(keyName, true);
                            setKeySource(`pointer:${event.pointerId}`, keyName, true);
                        });
                        const releaseVerticalKey = (event) => {
                            if (!activePointers.has(event.pointerId)) {
                                return;
                            }
                            activePointers.delete(event.pointerId);
                            setKeySource(`pointer:${event.pointerId}`, keyName, false);
                            setKeyButtonsPressed(keyName, Boolean(activeSources.get(keyName)?.size) || lockedKeys.has(keyName));
                        };
                        button.addEventListener('pointerup', releaseVerticalKey);
                        button.addEventListener('pointercancel', releaseVerticalKey);
                        button.addEventListener('lostpointercapture', releaseVerticalKey);
                        verticalButtons.appendChild(button);
                    });
                document.getElementById('language-button')
                    ?.addEventListener('click', updateVerticalButtonLabels);
                controlRow.appendChild(verticalButtons);
            }
            keyboard.prepend(controlRow);
        }

        player.appendChild(keyboard);
        keyboardButton?.removeAttribute('hidden');
        frame.addEventListener('load', releaseAllKeys);
        window.addEventListener('blur', releaseAllKeys);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                releaseAllKeys();
            }
        });
    }

    function watchProjectFrame() {
        const existingFrame = document.getElementById('scratch-player');
        if (existingFrame) {
            const project = getProject();
            if (project) {
                createKeyboard(existingFrame, project);
            }
            return;
        }

        const player = document.getElementById('project-show');
        if (!player) {
            return;
        }

        const observer = new MutationObserver(() => {
            const frame = document.getElementById('scratch-player');
            const project = getProject();
            if (frame && project) {
                observer.disconnect();
                createKeyboard(frame, project);
            }
        });
        observer.observe(player, { childList: true });
    }

    if (mobileQuery.matches) {
        watchProjectFrame();
    }
    const handleViewportChange = (event) => {
        if (event.matches) {
            watchProjectFrame();
        }
    };
    if (typeof mobileQuery.addEventListener === 'function') {
        mobileQuery.addEventListener('change', handleViewportChange);
    } else {
        mobileQuery.addListener(handleViewportChange);
    }
})();
