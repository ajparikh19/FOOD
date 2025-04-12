import React, { useState } from 'react';
import API from "../../http/api";
import { toast } from "react-toastify";

const Pagination = ({ apiEndPoint, setList, loading, setLoading, currPage, setCurrPage, totalPages, setTotalPages, links, setLinks, searchKey,searchParams }) => {

	const buildQueryString = () => {
		const params = new URLSearchParams({
		  page: currPage,
		  ...searchParams // Include all search/filter/sort parameters
		});
		return params.toString();
	  };

	const handlePageClick = async (url, page) => {
		try {
			if (!url || currPage === page) return;
			setCurrPage(page);
			setLoading(true);

			const response = await API.get(`${apiEndPoint}?${searchKey !== '' ? `search=${searchKey}&` : ''}page=${page}`);
			//const response = await API.get(`${apiEndPoint}?${buildQueryString()}`);


			if (response?.status === 200) {
				setList(response?.data?.data);
				setLinks(response?.data?.links);
				setCurrPage(response?.data.current_page);
				setTotalPages(response?.data.last_page);
			} else {
				toast.error(response?.message);
				console.error('Error while fetching:', response?.message);
			}
		} catch (error) {
			toast.error(error.message);
			console.error("Something went wrong!", error.message);
		} finally {
			setLoading(false);
		}
	};

	const renderPageNumbers = () => {
		return links?.slice(1, -1)?.map((link, index) => (
			<li key={index} className={`page-item ${link.active ? 'active' : ''} ${link.url === null ? 'disabled' : ''} me-3`}>
				<button
					disabled={loading || link.url === null}
					className={`btn btn-${link?.active ? '' : 'outline-'}primary`}
					onClick={() => handlePageClick(link.url, parseInt(link.label))}>
					{link.label}
				</button>
			</li>
		));
	};

	return (
		<div className="d-flex justify-content-between align-items-center">
			<div>
				<p>Showing Page {currPage} of {totalPages}</p>
			</div>

			<div className="d-flex justify-content-center align-items-center">
				<nav aria-label="Page navigation" className="pagination-style-4">
					<ul className="pagination mb-0 align-items-center">
						{/* Previous Page Button */}
						<li className="page-item me-3">
							<button
								disabled={loading || links[0]?.url === null}
								className="btn btn-primary"
								onClick={() => handlePageClick(links[0].url, currPage - 1)}
								title='Previous'
							>
								&laquo;
							</button>
						</li>


						{renderPageNumbers()}


						<li className="page-item">
							<button
								disabled={loading || links[links.length - 1].url === null}
								className="btn btn-primary"
								onClick={() => handlePageClick(links[links.length - 1].url, currPage + 1)}
								title='Next'
							>
								&raquo;
							</button>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	);
};

export default Pagination;
