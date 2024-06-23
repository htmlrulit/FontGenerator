import React, { useContext, useEffect, useState } from 'react';
import {
  Panel,
  PanelHeader,
  Header,
  Group,
  Div,
  Card,
  CardGrid,
  Text,
  Chip,
  Search
} from '@vkontakte/vkui';
import { GlobalContext } from '../context';

const Home = ({ id }) => {
  const { go } = useContext(GlobalContext);
  const [fonts, setFonts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFonts, setFilteredFonts] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    fetch('fonts.json')
        .then((response) => response.json())
        .then((data) => {
          setFonts(data);
          setFilteredFonts(data);
        })
        .catch((error) => console.error('Error fetching fonts:', error));
  }, []);

  const tagOptions = [
    { value: 'supportsRussian', label: 'Кириллица' },
    { value: 'big', label: 'Заглавные' },
    { value: 'small', label: 'Строчные' },
    { value: 'numbers', label: 'Цифры' }
  ];

  const handleSearchChange = (e) => {
    const query = e.target.value.slice(0, 16).toLowerCase();
    setSearchQuery(query);
    filterFonts(query, selectedTags);
  };

  const handleTagClick = (tag) => {
    const updatedTags = selectedTags.includes(tag) ? selectedTags.filter(t => t !== tag) : [...selectedTags, tag];
    setSelectedTags(updatedTags);
    filterFonts(searchQuery, updatedTags);
  };

  const filterFonts = (query, tags) => {
    setFilteredFonts(
        fonts.filter(font => {
          const matchesName = font.name.toLowerCase().includes(query);
          const matchesTags = tags.every(tag => {
            switch (tag) {
              case 'supportsRussian':
                return font.supportsRussian;
              case 'big':
                return font.big;
              case 'small':
                return font.small;
              case 'numbers':
                return font.numbers;
              default:
                return false;
            }
          });
          return matchesName && matchesTags;
        })
    );
  };

  const handleTagRemove = (tag) => {
    const updatedTags = selectedTags.filter(t => t !== tag);
    setSelectedTags(updatedTags);
    filterFonts(searchQuery, updatedTags);
  };

  return (
      <Panel id={id}>
        <PanelHeader>Шрифты</PanelHeader>
        <Group>
          <Div>
            <Search value={searchQuery} onChange={handleSearchChange} />
            <Div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
              {tagOptions.map(tag => (
                  <Chip
                      key={tag.value}
                      onClick={() => handleTagClick(tag.value)}
                      removable={false}
                      style={{
                        backgroundColor: 'transparent',
                        color: '#fff',
                        border: selectedTags.includes(tag.value) ? '3px solid #1e8bf7' : '3px solid #ccc',
                        cursor: 'pointer'
                      }}
                  >
                    {tag.label}
                  </Chip>
              ))}
            </Div>
          </Div>
        </Group>
        <Group header={<Header mode="secondary">{filteredFonts.length > 0 ? 'Выберите шрифт' : 'Шрифты не найдены'}</Header>}>
          <CardGrid size="l" style={{ paddingLeft: 12, paddingRight: 12 }}>
            {filteredFonts.length > 0 ? (
                filteredFonts.map((font) => (
                    <Card key={font.id} onClick={() => go(`font_${font.id}`)} style={{ margin: '8px', cursor: 'pointer', padding: '16px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                      <Div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <Text style={{ fontSize: 18, marginBottom: '8px' }}>
                          {font.name}
                        </Text>
                        <Text style={{ fontSize: 14, color: '#888', marginBottom: '16px' }}>
                          {font.exampleText}
                        </Text>
                        <div style={{ marginBottom: 8, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px' }}>
                          {font.supportsRussian && <Chip mode="primary" removable={false}>Кириллица</Chip>}
                          {font.big && <Chip mode="primary" removable={false}>Заглавные</Chip>}
                          {font.small && <Chip mode="primary" removable={false}>Строчные</Chip>}
                          {font.numbers && <Chip mode="primary" removable={false}>Цифры</Chip>}
                        </div>
                      </Div>
                    </Card>
                ))
            ) : (
                <Text></Text>
            )}
          </CardGrid>
        </Group>
      </Panel>
  );
};

export default Home;
