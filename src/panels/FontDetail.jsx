import React, { useState, useContext, useEffect } from 'react';
import { Panel, PanelHeader, Header, Group, Div, Textarea, Button, PanelHeaderBack, Snackbar, Text } from '@vkontakte/vkui';
import { GlobalContext } from '../context';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Icon16Done } from '@vkontakte/icons';

const FontDetail = ({ id, font }) => {
    const [text, setText] = useState('');
    const [convertedText, setConvertedText] = useState('');
    const [isConverted, setIsConverted] = useState(false);
    const [snackbar, setSnackbar] = useState(null);
    const { go } = useContext(GlobalContext);

    useEffect(() => {
        console.log(`Loaded font: ${font.name}`, font.map);
    }, [font]);

    const convertText = () => {
        const newText = text.split('').map(char => font.map[char] || char).join('');
        setConvertedText(newText);
        setIsConverted(true);
    };

    const handleInputChange = (e) => {
        const value = e.target.value.slice(0, 4096);
        setText(value);
        setIsConverted(false);
        setConvertedText('');
    };

    const clearSnackbar = () => {
        setSnackbar(null);
    };

    const showCopiedSnackbar = () => {
        clearSnackbar();
        setSnackbar(
            <Snackbar
                duration="1000"
                before={<Icon16Done fill="var(--vkui--color_icon_positive)" />}
                style={{ maxWidth: '100%', width: 'auto', boxSizing: 'border-box' }}
                onClose={() => setSnackbar(null)}
            >
                Результат скопирован в буфер обмена
            </Snackbar>
        );
    };

    return (
        <Panel id={id}>
            <PanelHeader before={<PanelHeaderBack onClick={() => go("home")} />}>{font.name}</PanelHeader>
            <div style={{ maxWidth: 600, width: "100%", marginInline: "auto", marginTop: 20 }}>
                <Group header={<Header mode="secondary">Преобразование текста</Header>}>
                    <Div style={{ position: 'relative' }}>
                        <Textarea
                            value={text}
                            onChange={handleInputChange}
                            placeholder="Введите текст"
                        />
                        {text.length > 0 && (
                            <Text style={{ position: 'absolute', top: 14, right: 16, color: '#888', backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '2px 6px', borderRadius: '4px' }}>
                                {text.length}/4096
                            </Text>
                        )}
                        <Button
                            stretched
                            size="l"
                            mode="secondary"
                            onClick={convertText}
                            style={{ marginTop: 10 }}
                            disabled={text.length === 0}
                        >
                            Преобразовать
                        </Button>
                        <Textarea
                            value={convertedText}
                            readOnly
                            style={{ marginTop: 20, fontFamily: font.preview, fontSize: 24, height: 'auto' }}
                        />
                        <CopyToClipboard text={convertedText} onCopy={showCopiedSnackbar}>
                            <Button
                                stretched
                                size="l"
                                mode={isConverted ? "primary" : "secondary"}
                                style={{ marginTop: 10 }}
                                disabled={!isConverted}
                            >
                                Копировать
                            </Button>
                        </CopyToClipboard>
                        {snackbar}
                    </Div>
                </Group>
            </div>
        </Panel>
    );
};

export default FontDetail;
