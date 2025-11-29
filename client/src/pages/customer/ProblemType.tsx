import { useCreateCase } from "@/hook/useCreateCase";
import { useCustomerStore } from "@/store/useCustomerStore";


const ProblemType = () => {
  const { selectedDepartment, problemDescription, setProblem } = useCustomerStore();
  const { mutate: createCase, isPending } = useCreateCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold mb-2">{selectedDepartment} Support</h1>
        <p className="text-gray-600 mb-8">Please describe your issue in detail</p>

        <textarea
          value={problemDescription}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Example: I tried to fund my wallet with ₦5000 but got an error..."
          className="w-full h-48 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        />

        <button
          onClick={() => createCase()}
          disabled={isPending || !problemDescription.trim()}
          className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50"
        >
          {isPending ? 'Creating Case...' : 'Submit Request'}
        </button>
      </div>
    </div>
  );
};

export default ProblemType;