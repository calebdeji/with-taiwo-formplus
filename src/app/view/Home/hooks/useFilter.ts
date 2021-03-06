import { useEffect, useRef, useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { TemplateCategory, TemplateDate, TemplateOrder } from 'app/api/types';
import useComponentDidMount from 'app/hooks/useComponentDidMount';
import { fetchAllContents, fetchContentsByFilter } from 'app/redux/contents/actions';
import { RootState } from 'app/redux/reducers';
import { GetFilteredDataParams } from 'app/utils/paginations';

export type Filters = Omit<GetFilteredDataParams, 'data' | 'currentIndex' | 'totalEntries'> & {
	query: string;
	category: TemplateCategory;
	order: TemplateOrder;
	date: TemplateDate;
};

const initialFilters: Filters = {
	query: '',
	category: 'all',
	order: 'default',
	date: 'default',
};

const useFilter = () => {
	const [filters, setFilters] = useState<Filters>(initialFilters);
	const initialQuery = useRef(filters.query);

	const { pagination, data } = useSelector((state: RootState) => state.contentReducer);
	const dispatch = useDispatch();

	const handleSearch = (event: ChangeEvent<HTMLInputElement>): any => {
		setFilters({ ...initialFilters, query: event.target.value });
	};

	const handleChangeInCategory = (category: TemplateCategory) => {
		setFilters((prevFilters) => ({ ...prevFilters, category }));
	};

	const handleChangeInOrder = (order: TemplateOrder) => {
		setFilters((prevFilters) => ({ ...prevFilters, order }));
	};

	const handleChangeInDate = (date: TemplateDate) => {
		setFilters((prevFilters) => ({ ...prevFilters, date }));
	};

	useEffect(() => {
		dispatch(fetchAllContents());
	}, [dispatch]);

	const handleNext = () => {
		dispatch(
			fetchContentsByFilter({
				...filters,
				currentIndex: (pagination.last_index || -1) + 1,
				data,
				//@ts-ignore
				totalEntries: pagination.total_entries,
			})
		);
	};

	const handlePrevious = () => {
		dispatch(
			fetchContentsByFilter({
				...filters,
				currentIndex: (pagination.last_index || 10) - 10,
				data,
				//@ts-ignore
				totalEntries: pagination.total_entries,
			})
		);
	};

	useComponentDidMount(() => {
		if (filters.query !== initialQuery.current) {
			initialQuery.current = filters.query;
			dispatch(
				fetchContentsByFilter({
					...filters,
					data,
				})
			);
		} else {
			dispatch(
				fetchContentsByFilter({
					...filters,
					data,
				})
			);
		}
	}, [filters]);

	return {
		filters,
		handleSearch,
		handleChangeInOrder,
		handleChangeInDate,
		handleChangeInCategory,
		handleNext,
		handlePrevious,
	};
};

export default useFilter;
