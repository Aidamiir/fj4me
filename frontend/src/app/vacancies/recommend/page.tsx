'use client';

import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Container, Typography, Box, Paper, Button, Grid, TextField, IconButton } from '@mui/material';

interface Vacancy {
    id: number;
    title: string;
    description: string;
}

const recommendedVacancies: Vacancy[] = [
    {
        id: 1,
        title: 'Junior Frontend Developer',
        description: 'Компания XYZ ищет начинающего разработчика для работы над современными веб-проектами.',
    },
    {
        id: 2,
        title: 'Internship in Digital Marketing',
        description: 'Практика в сфере цифрового маркетинга с возможностью последующего трудоустройства.',
    },
    {
        id: 3,
        title: 'Entry-Level Graphic Designer',
        description: 'Студент или начинающий дизайнер для поддержки команды по созданию креативных решений.',
    },
    {
        id: 4,
        title: 'Junior Backend Developer',
        description: 'Начальная позиция для разработчика, знакомого с Node.js и базами данных.',
    },
    {
        id: 5,
        title: 'Sales Internship',
        description: 'Стажировка в отделе продаж с обучением и практическими задачами.',
    },
    {
        id: 6,
        title: 'Customer Support Representative',
        description: 'Позиция в колл-центре, требующая коммуникабельности и базовых навыков работы с ПК.',
    },
    {
        id: 7,
        title: 'Junior Data Analyst',
        description: 'Начинающий аналитик данных для анализа информации и подготовки отчетов.',
    },
    {
        id: 8,
        title: 'Social Media Manager Intern',
        description: 'Стажировка по управлению социальными сетями с обучением у опытных специалистов.',
    },
    {
        id: 9,
        title: 'Content Writer',
        description: 'Начинающий копирайтер для создания текстов и контента для сайтов.',
    },
    {
        id: 10,
        title: 'IT Support Specialist',
        description: 'Поддержка пользователей и решение технических вопросов в офисе компании.',
    },
    {
        id: 11,
        title: 'HR Intern',
        description: 'Стажировка в отделе кадров с основами рекрутинга и работы с документами.',
    },
    {
        id: 12,
        title: 'Project Coordinator',
        description: 'Начальная позиция для координации проектов, организация встреч и коммуникация с клиентами.',
    },
];

export default function RecommendedVacanciesPage() {
    const router = useRouter();

    const handleVacancyClick = (id: number) => {
        console.log('Vacancy clicked:', id);
        // router.push(`/vacancy/${id}`);
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <Container sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                <IconButton onClick={handleBack}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
                    Рекомендованные вакансии
                </Typography>
                <TextField
                    placeholder="Поиск вакансий"
                    variant="outlined"
                    size="small"
                />
            </Box>

            <Grid container spacing={3}>
                {recommendedVacancies.map((vacancy) => (
                    <Grid item xs={12} key={vacancy.id}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography variant="h6">{vacancy.title}</Typography>
                            <Typography variant="body2">{vacancy.description}</Typography>
                            <Box textAlign="right">
                                <Button
                                    variant="outlined"
                                    onClick={() => handleVacancyClick(vacancy.id)}
                                    endIcon={<ArrowForwardIcon />}
                                >
                                    Подробнее
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}