import { Link } from 'react-router-dom';

// 🔹 Pagination component
// - Props:
//   • currentPage → current active page number
//   • totalPages → total number of pages
//   • pageSize → number of items per page
//   • totalItems → total number of items
//   • onPageChange → callback function to change page
const Pagination = ({ currentPage, totalPages, pageSize, totalItems, onPageChange }) => {
	// 🔹 Create an array of page numbers [1, 2, ..., totalPages]
	const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

	// 🔹 Calculate the starting and ending item numbers for current page
	const start = (currentPage - 1) * pageSize + 1;
	const end = Math.min(currentPage * pageSize, totalItems);

	return (
		<div className="influ-pagi">
			<ul>
				{/* 🔹 Previous page button */}
				<li>
					<Link to="#" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
						<i className="fas fa-chevron-left"></i>
					</Link>
				</li>

				{/* 🔹 Page number buttons */}
				{pages.map((page) => (
					<li key={page} className={page === currentPage ? 'active' : ''}>
						<Link to="#" onClick={() => onPageChange(page)}>{page}</Link>
					</li>
				))}

				{/* 🔹 Next page button */}
				<li>
					<Link to="#" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
						<i className="fas fa-chevron-right"></i>
					</Link>
				</li>
			</ul>

			{/* 🔹 Display item range info */}
			<p>Showing {totalItems === 0 ? 0 : `${start}–${end}`} of {totalItems} results</p>
		</div>
	)
}

export default Pagination;
