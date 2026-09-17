import Service from "../models/Service.js";

export const createService = async (req, res) => {

    console.log("BODY", req?.body)

    try{
        const { title, description, category, price, location } = req.body;

        if(!title || !description || !category || price === undefined) {
            return res.status(400).json({
                success: false,
                message: "Title, Description, Category and price are mandatory fields"
            });
        }

        const service = await Service.create({
            provider: req.user._id,
            title,
            description,
            category,
            price,
            location,
        });

        return res.status(200).json({
            success: true,
            message: "Successfully created service",
            service
        })
    }catch(error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`
        })
    }
}

//controller to get all service (isActive === true)
export const getAllServices = async ( req, res ) => {
    try {
        const services = await Service.find({
            isActive: true,
        }).populate("provider", "name email phone")

        return res.status(200).json({
            success: true,
            services
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error : ${error}`
        })
    }
}

//controller to get a service based on id
export const getServiceById = async (req, res) => {
    try {
      const service = await Service.findOne({
        _id: req.params.id,
        isActive: true,
      }).populate("provider", "name email phone");

      console.log("service", service);
  
      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service not found",
        });
      }
  
      res.status(200).json({
        success: true,
        service,
      });
    } catch (error) {
      console.error("Get service error:", error);
  
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
};

// update service
export const updateService = async (req, res) => {
    try {
        
        const { title, description, price, category, location } = req.body;

        const service = await Service.findOne({
            _id: req.params.id,
            isActive: true
        })

        if(!service){
            return res.status(401).json({
                success: false,
                message: "Unable to find service"
            })
        }

        //verify the ownership of the service
        if(service.provider.toString() !== req.user._id.toString()){
            return res.status(403).json({
                success: false,
                message: "You are not allowed to update this service"
            })
        }

        service.title = title ?? service.title;
        service.description = description ?? service.description;
        service.price = price ?? service.price;
        service.category = category ?? service.category;
        service.location = location ?? service.location;

        const updatedService = await service.save()

        res.status(200).json({
            success: true,
            updatedService
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`
        })
    }
}

export const deleteService = async (req, res) => {
    try{
        const service = await Service.findById(req.params.id);

        if(!service){
            return res.status(401).json({
                success: false,
                message: "Unable to find service"
            })
        }

        //verify the ownership of the service
        if(service.provider.toString() !== req.user._id.toString()){
            return res.status(403).json({
                success: false,
                message: "You are not allowed to update this service"
            })
        }

        service.isActive = false;

        await service.save();

        res.status(200).json({
            success: true,
            message: "Successfuly deleted the service!"
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`
        })
    }
}