import React, { useContext } from 'react';
import { Panel, PanelHeader, Header, Group, Cell, Div, Avatar, Button } from '@vkontakte/vkui';
import { GlobalContext } from '../context';

const FontsList = ({ id }) => {
    const { go } = useContext(GlobalContext);

    return (
        <Panel id={id}>
            <PanelHeader>Шрифты</PanelHeader>
            <div style={{ maxWidth: 600, width: "100%", marginInline: "auto", marginTop: 20 }}>
                <Group header={<Header mode="secondary">Выберите шрифт</Header>}>
                    <Div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        {FONTS.map(font => (
                            <Button
                                key={font.id}
                                stretched
                                size="l"
                                mode="secondary"
                                onClick={() => go(`font_${font.id}`)}
                                style={{ margin: 10 }}
                            >
                                {font.supportsRussian && '🇷🇺'}
                                <span style={{ fontFamily: font.preview }}>{font.preview}</span>
                            </Button>
                        ))}
                    </Div>
                </Group>
            </div>
        </Panel>
    );
};

export default FontsList;
