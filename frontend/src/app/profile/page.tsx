'use client';
import React from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Avatar,
    List,
    ListItem,
    ListItemText,
    Button,
    IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    const handleEdit = (section: string) => {
        console.log(`Редактировать раздел: ${section}`);
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <IconButton onClick={handleBack}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" component="h1" sx={{ ml: 2, flexGrow: 1 }}>
                    Мой профиль
                </Typography>
            </Box>

            <Paper sx={{ p: 4, mb: 4, position: 'relative' }} elevation={3}>
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <Button onClick={() => handleEdit('Основная информация')} startIcon={<EditIcon />}>
                        Редактировать
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                        sx={{ width: 80, height: 80 }}
                        src="/path/to/avatar.jpg"
                        alt="User Avatar"
                    />
                    <Box>
                        <Typography variant="h5">Иван Иванов</Typography>
                        <Typography variant="body1">ivan.ivanov@example.com</Typography>
                        <Typography variant="body1">+7 (123) 456-78-90</Typography>
                    </Box>
                </Box>
            </Paper>

            <Paper sx={{ p: 4, mb: 4, position: 'relative' }} elevation={3}>
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <Button onClick={() => handleEdit('Образование')} startIcon={<EditIcon />} size="small">
                        Редактировать
                    </Button>
                </Box>
                <Typography variant="h6" gutterBottom>
                    Образование
                </Typography>
                <List>
                    <ListItem>
                        <ListItemText
                            primary="Московский Государственный Университет"
                            secondary="Бакалавр, Факультет информатики (2018 – 2022)"
                        />
                    </ListItem>
                </List>
            </Paper>

            <Paper sx={{ p: 4, mb: 4, position: 'relative' }} elevation={3}>
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <Button onClick={() => handleEdit('Опыт работы / Стажировки')} startIcon={<EditIcon />} size="small">
                        Редактировать
                    </Button>
                </Box>
                <Typography variant="h6" gutterBottom>
                    Опыт работы / Стажировки
                </Typography>
                <List>
                    <ListItem>
                        <ListItemText
                            primary="Intern, Digital Marketing"
                            secondary="ООО «Реклама», Москва (2021)"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Junior Frontend Developer"
                            secondary="Стажировка в стартапе ABC (2022)"
                        />
                    </ListItem>
                </List>
            </Paper>

            <Paper sx={{ p: 4, mb: 4, position: 'relative' }} elevation={3}>
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <Button onClick={() => handleEdit('Навыки')} startIcon={<EditIcon />} size="small">
                        Редактировать
                    </Button>
                </Box>
                <Typography variant="h6" gutterBottom>
                    Навыки
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {['JavaScript', 'React', 'Node.js', 'TypeScript', 'CSS'].map((skill) => (
                        <Paper key={skill} sx={{ px: 2, py: 0.5 }} variant="outlined">
                            {skill}
                        </Paper>
                    ))}
                </Box>
            </Paper>

            <Paper sx={{ p: 4, mb: 4, position: 'relative' }} elevation={3}>
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <Button onClick={() => handleEdit('Резюме')} startIcon={<EditIcon />} size="small">
                        Редактировать
                    </Button>
                </Box>
                <Typography variant="h6" gutterBottom>
                    Резюме
                </Typography>
                <Button variant="contained" sx={{ mt: 2 }}>
                    Скачать резюме
                </Button>
            </Paper>

            <Paper sx={{ p: 4, mb: 4, position: 'relative' }} elevation={3}>
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <Button onClick={() => handleEdit('Проекты и достижения')} startIcon={<EditIcon />} size="small">
                        Редактировать
                    </Button>
                </Box>
                <Typography variant="h6" gutterBottom>
                    Проекты и достижения
                </Typography>
                <List>
                    <ListItem>
                        <ListItemText
                            primary="Проект «XYZ»"
                            secondary="Разработка веб-приложения для управления задачами"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Участие в хакатоне 2021"
                            secondary="Призовое место в командном соревновании"
                        />
                    </ListItem>
                </List>
            </Paper>

            <Paper sx={{ p: 4, mb: 4, position: 'relative' }} elevation={3}>
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <Button onClick={() => handleEdit('Отклики и вакансии')} startIcon={<EditIcon />} size="small">
                        Редактировать
                    </Button>
                </Box>
                <Typography variant="h6" gutterBottom>
                    Отклики и вакансии
                </Typography>
                <List>
                    <ListItem>
                        <ListItemText
                            primary="Вакансия: Junior Developer"
                            secondary="Статус: Рассматривается"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Вакансия: Content Writer"
                            secondary="Статус: Отклик отправлен"
                        />
                    </ListItem>
                </List>
            </Paper>
        </Container>
    );
}