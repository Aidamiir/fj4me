'use client';
import React from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Paper,
    IconButton,
    TextField
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { useRouter } from 'next/navigation';

import { LogoutButton } from '@/app/auth/_ui';
import { RecommendedVacanciesSlider } from '@/app/vacancies/_ui';
import { ThemeToggle } from '@/components/theme';
import { CLIENT_MAP } from '@/common/constants';
import { RecommendedResumesSlider } from '@/app/resumes/_ui';

interface Vacancy {
    id: number;
    title: string;
    description: string;
    salary: number;
}

const recommendedVacancies: Vacancy[] = [
    {
        id: 1,
        title: 'Junior Frontend Developer',
        description:
            'Компания XYZ ищет начинающего разработчика для работы над современными веб-проектами.',
        salary: 60000,
    },
    {
        id: 2,
        title: 'Internship in Digital Marketing',
        description:
            'Практика в сфере цифрового маркетинга с возможностью последующего трудоустройства.',
        salary: 35000,
    },
    {
        id: 3,
        title: 'Entry-Level Graphic Designer',
        description:
            'Студент или начинающий дизайнер для поддержки команды по созданию креативных решений.',
        salary: 40000,
    },
    {
        id: 4,
        title: 'Junior Backend Developer',
        description:
            'Начальная позиция для разработчика, знакомого с Node.js и базами данных.',
        salary: 65000,
    },
    {
        id: 5,
        title: 'Sales Internship',
        description:
            'Стажировка в отделе продаж с обучением и практическими задачами.',
        salary: 30000,
    },
    {
        id: 6,
        title: 'Customer Support Representative',
        description:
            'Позиция в колл-центре, требующая коммуникабельности и базовых навыков работы с ПК.',
        salary: 28000,
    },
    {
        id: 7,
        title: 'Junior Data Analyst',
        description:
            'Начинающий аналитик данных для анализа информации и подготовки отчетов.',
        salary: 50000,
    },
    {
        id: 8,
        title: 'Social Media Manager Intern',
        description:
            'Стажировка по управлению социальными сетями с обучением у опытных специалистов.',
        salary: 32000,
    },
    {
        id: 9,
        title: 'Content Writer',
        description:
            'Начинающий копирайтер для создания текстов и контента для сайтов.',
        salary: 30000,
    },
    {
        id: 10,
        title: 'IT Support Specialist',
        description:
            'Поддержка пользователей и решение технических вопросов в офисе компании.',
        salary: 40000,
    },
    {
        id: 11,
        title: 'HR Intern',
        description:
            'Стажировка в отделе кадров с основами рекрутинга и работы с документами.',
        salary: 35000,
    },
    {
        id: 12,
        title: 'Project Coordinator',
        description:
            'Начальная позиция для координации проектов, организация встреч и коммуникация с клиентами.',
        salary: 45000,
    },
];

interface Resume {
    id: number;
    title: string;
    description: string;
    expectedSalary: number;
}

const recommendedResumes: Resume[] = [
    {
        id: 101,
        title: 'Резюме: Junior Frontend Developer',
        description:
            'Опыт работы: стажировки и фриланс-проекты. Навыки: React, JavaScript, CSS.',
        expectedSalary: 55000,
    },
    {
        id: 102,
        title: 'Резюме: Digital Marketer',
        description:
            'Образование в маркетинге, опыт работы с SMM и аналитикой. Ищу работу в digital-сфере.',
        expectedSalary: 40000,
    },
    {
        id: 103,
        title: 'Резюме: Graphic Designer',
        description:
            'Креативный дизайнер с опытом работы над рекламными кампаниями и веб-дизайном.',
        expectedSalary: 45000,
    },
    {
        id: 104,
        title: 'Резюме: Backend Developer',
        description:
            'Опыт разработки на Node.js, знание баз данных. Ищу позицию Junior Backend Developer.',
        expectedSalary: 60000,
    },
    {
        id: 105,
        title: 'Резюме: Junior Frontend Developer',
        description:
            'Опыт работы: стажировки и фриланс-проекты. Навыки: React, JavaScript, CSS.',
        expectedSalary: 55000,
    },
    {
        id: 106,
        title: 'Резюме: Digital Marketer',
        description:
            'Образование в маркетинге, опыт работы с SMM и аналитикой. Ищу работу в digital-сфере.',
        expectedSalary: 40000,
    },
    {
        id: 107,
        title: 'Резюме: Graphic Designer',
        description:
            'Креативный дизайнер с опытом работы над рекламными кампаниями и веб-дизайном.',
        expectedSalary: 45000,
    },
    {
        id: 108,
        title: 'Резюме: Backend Developer',
        description:
            'Опыт разработки на Node.js, знание баз данных. Ищу позицию Junior Backend Developer.',
        expectedSalary: 60000,
    },
];

export default function HomePage() {
    const router = useRouter();

    const handleProfileClick = () => {
        router.push(CLIENT_MAP.PROFILE.ROOT);
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const query = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
        router.push(`${CLIENT_MAP.SEARCH.ROOT}?q=${encodeURIComponent(query)}`);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1">
                    FJ4ME
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <ThemeToggle />
                    <IconButton onClick={handleProfileClick} color="primary">
                        <AccountCircleIcon fontSize="large" />
                    </IconButton>
                    <LogoutButton />
                </Box>
            </Box>

            {/* Hero Section */}
            <Paper sx={{ p: 4, mb: 4, textAlign: 'center' }} elevation={3}>
                <Typography variant="h5" mb={2}>
                    Найди работу, практику или стажировку своей мечты
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSearchSubmit}
                    noValidate
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        maxWidth: '500px',
                        margin: '0 auto',
                    }}
                >
                    <TextField
                        name="search"
                        fullWidth
                        placeholder="Ключевые слова..."
                        variant="outlined"
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ mr: 1 }} />,
                        }}
                    />
                    <Button type="submit" variant="contained">
                        Найти
                    </Button>
                </Box>
            </Paper>

            {/* Categories */}
            <Box mb={4}>
                <Typography variant="h6" mb={2}>
                    Категории вакансий
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            sx={{
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 1,
                            }}
                            elevation={2}
                        >
                            <SchoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                            <Typography>Стажировки</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            sx={{
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 1,
                            }}
                            elevation={2}
                        >
                            <WorkOutlineIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                            <Typography>Практика</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            sx={{
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 1,
                            }}
                            elevation={2}
                        >
                            <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                            <Typography>Первая работа</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            sx={{
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 1,
                            }}
                            elevation={2}
                        >
                            <BusinessCenterIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                            <Typography>Постоянная занятость</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            {/* Recommended Vacancies Slider */}
            <Box mb={4}>
                <RecommendedVacanciesSlider vacancies={recommendedVacancies} />
            </Box>

            {/* Employer Section */}
            <Box mb={4}>
                <Paper sx={{ p: 4, textAlign: 'center' }} elevation={3}>
                    <Typography variant="h6" mb={2}>
                        Для работодателей
                    </Typography>
                    <Typography variant="body2" mb={2}>
                        Размещайте вакансии и находите лучших кандидатов.
                    </Typography>
                    <Button variant="outlined">Разместить вакансию</Button>
                </Paper>
            </Box>

            <Box mb={4}>
                <RecommendedResumesSlider resumes={recommendedResumes} />
            </Box>
        </Container>
    );
}