import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function RequestService() {
  const navigate = useNavigate();

  const [providers, setProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    serviceType: "",
    description: "",
    location: "",
    providerId: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await api.get("/api/providers");

        const availableProviders = response.data.filter(
          (provider) => provider.status === "AVAILABLE"
        );

        setProviders(availableProviders);
      } catch (err) {
        console.error("Provider loading error:", err);
        setError("Unable to load service providers.");
      } finally {
        setLoadingProviders(false);
      }
    };

    fetchProviders();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => { 
    const file = e.target.files[0]; 
    
    setError(""); 

    if (!file) { 
      setFormData((prev) => ({ 
        ...prev, image: null, 
      })); 
      
      setImagePreview(""); 
      return; 
    } 
    
    // Allow only image files 
    if (!file.type.startsWith("image/")) { 
      setError("Please select a valid image file."); 
      e.target.value = ""; 
      return; 
    } 
    
    // Maximum file size: 5MB 
    if (file.size > 5 * 1024 * 1024) { 
      setError("Image size must be less than 5MB."); 
      e.target.value = ""; 
      return; 
    } 
    
    setFormData((prev) => ({ 
      ...prev, 
      image: file, 
    })); 
    
    // Create preview 
    const previewUrl = URL.createObjectURL(file); 
    setImagePreview(previewUrl); 
  }; 
  
  const removeImage = () => { 
    setFormData((prev) => ({ 
      ...prev, 
      image: null, 
    })); 
    
    setImagePreview(""); 
    
    const fileInput = document.getElementById("image"); 
    
    if (fileInput) { 
      fileInput.value = ""; 
    } 
  };


  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   setError("");
  //   setSuccess("");
  //   setLoading(true);

  //   try {
  //     const user = JSON.parse(localStorage.getItem("user"));

  //     if (!user || !user.id) {
  //       setError("Please login first.");
  //       navigate("/login");
  //       return;
  //     }

  //     const requestData = {
  //       customerId: String(user.id),
  //       serviceType: formData.serviceType,
  //       description: formData.description,
  //       location: formData.location,
  //       providerId: formData.providerId,
  //     };

  //     const multipartData = new FormData();

  //       multipartData.append(
  //         "request",
  //         new Blob([JSON.stringify(requestData)], {
  //           type: "application/json",
  //         })
  //       );

  //       if (formData.image) {
  //         multipartData.append("image", formData.image);
  //       }

  //     const response = await api.post("/api/requests", multipartData);

  //     console.log("Request created:", response.data);

  //     setSuccess("Service request created successfully!");

  //     setFormData({
  //       serviceType: "",
  //       description: "",
  //       location: "",
  //       providerId: "",
  //       image: null,
  //     });

  //     setImagePreview("");

  //     const fileInput = document.getElementById("image"); 
      
  //     if (fileInput) { 
  //       fileInput.value = ""; 
  //     }

  //   } catch (err) {
  //     console.error("Request creation error:", err);

  //     setError(
  //       err.response?.data?.message ||
  //       (typeof err.response?.data === "string"
  //         ? err.response.data
  //         : "Failed to create service request.")
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.id) {
        setError("Please login first.");
        navigate("/login");
        return;
      }

      // Create request object
      const requestData = {
        customerId: String(user.id),
        serviceType: formData.serviceType,
        description: formData.description,
        location: formData.location,
        providerId: formData.providerId,
      };

      // Create multipart form data
      const multipartData = new FormData();

      // Add request JSON as a Blob
      multipartData.append(
        "request",
        new Blob(
          [JSON.stringify(requestData)],
          { type: "application/json" }
        )
      );

      // Add image if selected
      if (formData.image) {
        multipartData.append("image", formData.image);
      }

      // Send multipart/form-data request
      const response = await api.post(
        "/api/requests",
        multipartData
      );

      console.log("Request created:", response.data);

      setSuccess("Service request created successfully!");

      // Reset form
      setFormData({
        serviceType: "",
        description: "",
        location: "",
        providerId: "",
        image: null,
      });

      setImagePreview("");

      const fileInput = document.getElementById("image");

      if (fileInput) {
        fileInput.value = "";
      }

    } catch (err) {
      console.error("Request creation error:", err);

      setError(
        err.response?.data?.message ||
        (typeof err.response?.data === "string"
          ? err.response.data
          : "Failed to create service request.")
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Header */}
        <div>
          <Link
            to="/customer/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Request a Service
            </h1>
          </div>
          <p className="text-sm text-slate-500">
            Fill in the details below and we'll match you with a provider.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="p-4 text-sm text-green-700 bg-green-50 rounded-xl border border-green-200 flex items-start gap-3">
            <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">{success}</p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Service Type */}
            <div>
              <label htmlFor="serviceType" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Service Type
              </label>
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 bg-slate-50/50 focus:bg-white outline-none text-sm"
              >
                <option value="">Select service</option>
                <option value="PLUMBING">Plumbing</option>
                <option value="ELECTRICAL">Electrical</option>
                <option value="CLEANING">Cleaning</option>
                <option value="AC_REPAIR">AC Repair</option>
                <option value="CARPENTRY">Carpentry</option>
                <option value="PAINTING">Painting</option>
                <option value="GARDENING">Gardening</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the service you need"
                rows="5"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white outline-none text-sm resize-none"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Location
              </label>
              <input
                id="location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter service location"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white outline-none text-sm"
              />
            </div>

            {/* Image Upload */} 
            <div> 
              <label 
                htmlFor="image" 
                className="block text-sm font-semibold text-slate-700 mb-1.5" > 
                
                Service Image 
                
                <span className="text-slate-400 font-normal"> 
                  {" "} (Optional) 
                </span> 
              </label> 
              
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 bg-slate-50/50 hover:bg-slate-50 transition-all"> 
                <input 
                  id="image" 
                  type="file" 
                  name="image" 
                  accept="image/jpeg,image/png,image/jpg,image/webp" 
                  onChange={handleFileChange} 
                  className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold 
                             file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer" /> 
                             
                  <p className="mt-2 text-xs text-slate-500"> 
                    JPG, PNG or WEBP. Maximum file size: 5MB. 
                  </p> 
              </div> 
              
              {/* Image Preview */} 
              {imagePreview && ( 
                <div className="mt-4"> 
                  <div className="flex items-center justify-between mb-2"> 
                    <p className="text-sm font-semibold text-slate-700"> 
                      Image Preview 
                    </p> 
                    <button 
                      type="button" 
                      onClick={removeImage} 
                      className="text-sm font-medium text-red-600 hover:text-red-700" > 
                      Remove 
                    </button> 
                  </div> 
                  
                  <img 
                    src={imagePreview} 
                    alt="Selected service" 
                    className="w-full max-h-64 object-cover rounded-xl border border-slate-200" /> 
                    {formData.image && ( 
                      <p className="mt-2 text-xs text-slate-500"> 
                         {formData.image.name} ( 
                          {(formData.image.size / 1024 / 1024).toFixed(2)} MB) 
                      </p> 
                    )} 
                </div> 
              )} 
            </div>

            {/* Provider */}
            <div>
              <label htmlFor="providerId" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Select Provider
              </label>

              {loadingProviders ? (
                <p className="text-sm text-slate-500">Loading providers...</p>
              ) : (
                <select
                  id="providerId"
                  name="providerId"
                  value={formData.providerId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 bg-slate-50/50 focus:bg-white outline-none text-sm"
                >
                  <option value="">Select a provider</option>

                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name} - {provider.serviceType} - {provider.location}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                "Submit Request"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RequestService;