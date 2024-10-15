
import { ReportDetails, Vectors } from "components/tasks/types";

const ReportDetailsInfo = ({ reportDetails }: { reportDetails: ReportDetails }) => {

  return (
    <>
    <div className="fs-14 font-mdm brd-bt pb-10 mt-60">
      {reportDetails.task.host} |{" "}
      {new Date(reportDetails.started_at).toLocaleDateString()}{" "}
      {reportDetails.started_at.slice(11, 19)}
    </div>
    <div className="reports_scroll">
      {!!reportDetails?.data &&
        reportDetails.data.message.vectors.map(
          (vector: Vectors, index) => (
            <div key={index} style={{"width":"80%"}}>
              <div className="fs-12 mt-20">{vector.date}</div>
              <div className="fs-14 mt-20">{vector.description}</div>
              <div className="fs-14 mb-20">{vector.name}</div>
              <div>{vector.status}</div>
            </div>
          )
        )}
    </div>
  </>
  );
};
export default ReportDetailsInfo;