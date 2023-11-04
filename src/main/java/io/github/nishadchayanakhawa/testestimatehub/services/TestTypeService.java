package io.github.nishadchayanakhawa.testestimatehub.services;

//import section
//logger
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
//java utils
import java.util.List;
//model mapper
import org.modelmapper.ModelMapper;
//spring
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;
//model
import io.github.nishadchayanakhawa.testestimatehub.model.TestType;
import io.github.nishadchayanakhawa.testestimatehub.model.dto.TestTypeDTO;
import io.github.nishadchayanakhawa.testestimatehub.repositories.TestTypeRepository;
//exceptions
import io.github.nishadchayanakhawa.testestimatehub.services.exceptions.DuplicateEntityException;
import io.github.nishadchayanakhawa.testestimatehub.services.exceptions.EntityNotFoundException;
import io.github.nishadchayanakhawa.testestimatehub.services.exceptions.TransactionException;

/**
 * <b>Class Name</b>: TestTypeService<br>
 * <b>Description</b>: Service for processing Test Type.<br>
 * 
 * @author nishad.chayanakhawa
 */
@Service
public class TestTypeService {
	// logger
	private static final Logger logger = LoggerFactory.getLogger(TestTypeService.class);

	// test type repository
	@Autowired
	private TestTypeRepository testTypeRepository;

	// model mapper
	@Autowired
	private ModelMapper modelMapper;

	/**
	 * <b>Method Name</b>: save<br>
	 * <b>Description</b>: Save test type.<br>
	 * 
	 * @param testTypeToSaveDTO test type to save as
	 *                          {@link io.github.nishadchayanakhawa.testestimatehub.model.dto.TestTypeDTO
	 *                          TestTypeDTO}
	 * @return saved test type as
	 *         {@link io.github.nishadchayanakhawa.testestimatehub.model.dto.TestTypeDTO
	 *         TestTypeDTO}
	 */
	public TestTypeDTO save(TestTypeDTO testTypeToSaveDTO) {
		logger.debug("Saving Test Type: {}", testTypeToSaveDTO);
		try {
			// save test type
			TestTypeDTO testTypeSavedDTO = modelMapper.map(
					this.testTypeRepository.save(modelMapper.map(testTypeToSaveDTO, TestType.class)),
					TestTypeDTO.class);
			logger.debug("Saved Test Type: {}", testTypeSavedDTO);
			// return saved instance
			return testTypeSavedDTO;
		} catch (DataIntegrityViolationException e) {
			// throw exception when test type name is not unique
			throw (DuplicateEntityException) new DuplicateEntityException("Test Type", "name",
					testTypeToSaveDTO.getName()).initCause(e);
		} catch (TransactionSystemException e) {
			throw (TransactionException) new TransactionException(e).initCause(e);
		}
	}

	/**
	 * <b>Method Name</b>: getAll<br>
	 * <b>Description</b>: Get list of test types as - {@link java.util.List List}
	 * of {@link io.github.nishadchayanakhawa.testestimatehub.model.dto.TestTypeDTO
	 * TestTypeDTO}
	 * 
	 * @return
	 */
	public List<TestTypeDTO> getAll() {
		// get list of saved test types
		logger.debug("Retreiving all test type records");
		List<TestTypeDTO> testTypes = this.testTypeRepository.findAll().stream()
				.map(testType -> modelMapper.map(testType, TestTypeDTO.class)).toList();
		logger.debug("Test types: {}", testTypes);
		// return the list
		return testTypes;
	}

	/**
	 * <b>Method Name</b>: get<br>
	 * <b>Description</b>: Get test type as
	 * {@link io.github.nishadchayanakhawa.testestimatehub.model.dto.TestTypeDTO
	 * TestTypeDTO} based on id
	 * 
	 * @param id test type id as as {@link java.lang.Long Long}
	 * @return matching test type as
	 *         {@link io.github.nishadchayanakhawa.testestimatehub.model.dto.TestTypeDTO
	 *         TestTypeDTO}
	 */
	public TestTypeDTO get(Long id) {
		// retreive test type based on id
		logger.debug("Retreiving test type for id {}", id);
		TestTypeDTO testTypeDTO = modelMapper.map(
				this.testTypeRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Test Type", id)),
				TestTypeDTO.class);
		logger.debug("Retreived test type: {}", testTypeDTO);
		// return test type
		return testTypeDTO;
	}

	/**
	 * <b>Method Name</b>: delete<br>
	 * <b>Description</b>: Delete test type.<br>
	 * 
	 * @param testTypeToDeleteDTO test type to delete as
	 *                            {@link io.github.nishadchayanakhawa.testestimatehub.model.dto.TestTypeDTO
	 *                            TestTypeDTO}. Only id is required, other
	 *                            properties are ignored and can be null.
	 */
	public void delete(Long id) {
		// delete test type record
		logger.debug("Deleting test type with id: {}", id);
		this.testTypeRepository.deleteById(id);
		logger.debug("Deleted test type successfully.");
	}
}