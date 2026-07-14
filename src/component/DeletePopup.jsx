import { Link } from 'react-router-dom'

// 🔹 DeletePopup Component
// - Reusable confirmation modal for delete actions
// - Props:
//   • confirmDelete → callback function executed when user confirms delete
//   • currentData → item/data to be passed into confirmDelete
const DeletePopup = ({ confirmDelete, currentData }) => {
    return (
        <div
            className="modal animate__animated animate__bounceIn my-popup"
            id="delete-pop"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="myModalLabel"
        >
            <div className="modal-dialog modal-dialog-edit" role="document">
                <div className="modal-content clearfix">
                    {/* 🔸 Modal Header with Close Button */}
                    <div className="modal-heading">
                        <button
                            type="button"
                            className="close close-btn-front"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">
                                <img src="/images/fill-cross-pop.svg" alt="" />
                            </span>
                        </button>
                    </div>

                    {/* 🔸 Modal Body */}
                    <div className="modal-body">
                        <div className="delete-pop-wrap">
                            <form>
                                <div className="delete-pop-inner">
                                    {/* Delete icon */}
                                    <img src="/images/delete-pop.svg" alt="" style={{ width: "50px" }} />
                                    {/* Confirmation message */}
                                    <p className="my-2">Are you sure you want to Delete?</p>
                                </div>

                                {/* 🔸 Action Buttons */}
                                <div className="delete-pop-btn">
                                    {/* Cancel button → closes modal only */}
                                    <Link
                                        to="#"
                                        className="active"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    >
                                        Cancel
                                    </Link>

                                    {/* Yes button → triggers confirmDelete callback with currentData */}
                                    <Link
                                        to="#"
                                        onClick={() => confirmDelete(currentData)}
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    >
                                        Yes
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeletePopup
