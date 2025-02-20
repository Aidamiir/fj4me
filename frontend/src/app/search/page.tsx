'use client';
import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    TextField,
    Grid,
    Paper,
    Button,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSearchParams, useRouter } from 'next/navigation';

type SearchType = 'vacancies' | 'resumes';

interface Job {
    id: number;
    title: string;
    description: string;
    location: string;
    salary: number; // зарплата в рублях
}

// Dummy data for vacancies and resumes with salary info
const dummyVacancies: Job[] = [
    {
        id: 1,
        title: 'Junior Frontend Developer',
        description:
            'Компания XYZ ищет начинающего разработчика для работы над современными веб-проектами.',
        location: 'Москва',
        salary: 60000,
    },
    {
        id: 2,
        title: 'Internship in Digital Marketing',
        description:
            'Практика в сфере цифрового маркетинга с возможностью последующего трудоустройства.',
        location: 'Санкт-Петербург',
        salary: 35000,
    },
    {
        id: 3,
        title: 'Entry-Level Graphic Designer',
        description:
            'Студент или начинающий дизайнер для поддержки команды по созданию креативных решений.',
        location: 'Удаленно',
        salary: 40000,
    },
    {
        id: 4,
        title: 'Junior Backend Developer',
        description:
            'Начальная позиция для разработчика, знакомого с Node.js и базами данных.',
        location: 'Москва',
        salary: 65000,
    },
    {
        id: 5,
        title: 'Sales Internship',
        description:
            'Стажировка в отделе продаж с обучением и практическими задачами.',
        location: 'Москва',
        salary: 30000,
    },
    {
        id: 6,
        title: 'Customer Support Representative',
        description:
            'Позиция в колл-центре, требующая коммуникабельности и базовых навыков работы с ПК.',
        location: 'Санкт-Петербург',
        salary: 28000,
    },
];

const dummyResumes: Job[] = [
    {
        id: 101,
        title: 'Резюме: Junior Frontend Developer',
        description:
            'Опыт работы: стажировки и фриланс-проекты. Навыки: React, JavaScript, CSS.',
        location: 'Москва',
        salary: 55000, // ожидаемая зарплата
    },
    {
        id: 102,
        title: 'Резюме: Digital Marketer',
        description:
            'Образование в маркетинге, опыт работы с SMM и аналитикой. Ищу работу в digital-сфере.',
        location: 'Санкт-Петербург',
        salary: 40000,
    },
    {
        id: 103,
        title: 'Резюме: Graphic Designer',
        description:
            'Креативный дизайнер с опытом работы над рекламными кампаниями и веб-дизайном.',
        location: 'Удаленно',
        salary: 45000,
    },
];

export default function SearchPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [category, setCategory] = useState('Все');
    const [location, setLocation] = useState('Все');
    const [minSalary, setMinSalary] = useState('');
    const [maxSalary, setMaxSalary] = useState('');
    const [searchType, setSearchType] = useState<SearchType>('vacancies');
    const [results, setResults] = useState<Job[]>([]);

    // Handle back button
    const handleBack = () => {
        router.back();
    };

    // Handle search type change
    const handleSearchTypeChange = (
        event: React.MouseEvent<HTMLElement>,
        newType: SearchType | null
    ) => {
        if (newType !== null) {
            setSearchType(newType);
        }
    };

    // Simulate fetching results based on query, filters, and search type
    useEffect(() => {
        const dummyData = searchType === 'vacancies' ? dummyVacancies : dummyResumes;
        const filtered = dummyData.filter((job) => {
            const matchesQuery =
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory =
                category === 'Все'
                    ? true
                    : job.title.toLowerCase().includes(category.toLowerCase());
            const matchesLocation =
                location === 'Все'
                    ? true
                    : job.location.toLowerCase() === location.toLowerCase();
            // Parse salary filters if set
            const jobSalary = job.salary;
            const min = minSalary ? parseInt(minSalary) : 0;
            const max = maxSalary ? parseInt(maxSalary) : Infinity;
            const matchesSalary = jobSalary >= min && jobSalary <= max;
            return matchesQuery && matchesCategory && matchesLocation && matchesSalary;
        });
        setResults(filtered);
    }, [searchQuery, category, location, minSalary, maxSalary, searchType]);

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Optionally update URL with new search parameters:
        // router.push(`/search?q=${searchQuery}&category=${category}&location=${location}&minSalary=${minSalary}&maxSalary=${maxSalary}&type=${searchType}`);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header with back button */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
                <IconButton onClick={handleBack}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" component="h1">
                    Поиск
                </Typography>
            </Box>

            {/* Search and type toggle */}
            <Box
                component="form"
                onSubmit={handleSearchSubmit}
                sx={{ display: 'flex', gap: 2, mb: 4 }}
            >
                <TextField
                    name="search"
                    fullWidth
                    label="Введите запрос"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" variant="contained">
                    Найти
                </Button>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                {/* Category select */}
                <FormControl variant="outlined" sx={{ minWidth: 150 }}>
                    <InputLabel id="category-label">Категория</InputLabel>
                    <Select
                        labelId="category-label"
                        label="Категория"
                        value={category}
                        onChange={(e) =>
                            setCategory(e.target.value as string)
                        }
                    >
                        <MenuItem value="Все">Все</MenuItem>
                        <MenuItem value="it">IT</MenuItem>
                        <MenuItem value="marketing">Маркетинг</MenuItem>
                        <MenuItem value="design">Дизайн</MenuItem>
                        <MenuItem value="sales">Продажи</MenuItem>
                    </Select>
                </FormControl>

                {/* Location select */}
                <FormControl variant="outlined" sx={{ minWidth: 150 }}>
                    <InputLabel id="location-label">Локация</InputLabel>
                    <Select
                        labelId="location-label"
                        label="Локация"
                        value={location}
                        onChange={(e) =>
                            setLocation(e.target.value as string)
                        }
                    >
                        <MenuItem value="Все">Все</MenuItem>
                        <MenuItem value="Москва">Москва</MenuItem>
                        <MenuItem value="Санкт-Петербург">Санкт-Петербург</MenuItem>
                        <MenuItem value="Удаленно">Удаленно</MenuItem>
                    </Select>
                </FormControl>

                {/* Salary filter */}
                <TextField
                    label="Мин. з/п"
                    variant="outlined"
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                    sx={{ minWidth: 120 }}
                    type="number"
                />
                <TextField
                    label="Макс. з/п"
                    variant="outlined"
                    value={maxSalary}
                    onChange={(e) => setMaxSalary(e.target.value)}
                    sx={{ minWidth: 120 }}
                    type="number"
                />

                {/* Search type toggle */}
                <ToggleButtonGroup
                    color="primary"
                    value={searchType}
                    exclusive
                    onChange={handleSearchTypeChange}
                    sx={{ mb: 2 }}
                >
                    <ToggleButton value="vacancies">Вакансии</ToggleButton>
                    <ToggleButton value="resumes">Резюме</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* Search Results */}
            <Box>
                <Typography variant="h6" mb={2}>
                    Результаты поиска
                </Typography>
                <Grid container spacing={3}>
                    {results.length > 0 ? (
                        results.map((job) => (
                            <Grid item xs={12} key={job.id}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        {searchType === 'vacancies' ? 'Вакансия' : 'Резюме'}
                                    </Typography>
                                    <Typography variant="h6">{job.title}</Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        {job.description}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                        {job.location} | З/п: {job.salary} руб.
                                    </Typography>
                                    <Box textAlign="right" mt={1}>
                                        <Button variant="outlined" size="small">
                                            Подробнее
                                        </Button>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Typography variant="body1">
                                По вашему запросу вакансий не найдено.
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Container>
    );
}