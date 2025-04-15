import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
  IconButton,
  useDisclosure,
  useToast,
  Tooltip
} from '@chakra-ui/react';
import Select from 'react-select'
import axios from 'axios';
import { Download } from 'lucide-react';

const ExcelReportDownloadButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [reportType, setReportType] = useState('whole');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('both');

  const months = [
    {
      label: 'January',
      value: 0
    },
    {
      label: 'February',
      value: 1
    },
    {
      label: 'March',
      value: 2
    },
    {
      label: 'April',
      value: 3
    },
    {
      label: 'May',
      value: 4
    },
    {
      label: 'June',
      value: 5
    },
    {
      label: 'July',
      value: 6
    },
    {
      label: 'August',
      value: 7
    },
    {
      label: 'September',
      value: 8
    },
    {
      label: 'October',
      value: 9
    },
    {
      label: 'November',
      value: 10
    },
    {
      label: 'December',
      value: 11
    }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i).map((year) => ({ label: year, value: year }));

  const today = new Date();
  const [month, setMonth] = useState(months.find((month) => month.value === today.getMonth()));
  const [year, setYear] = useState(years.find((year) => year.value === today.getFullYear()));
  const [itEngineers, setItEngineers] = useState([]);
  const [itEngineer, setItEngineer] = useState();
  const [isDownLoading, setIsDownloading] = useState(false);
  const apiIp = process.env.REACT_APP_API_IP;

  const handleDownload = async () => {
    try {
      const queryParams = [];
      if (itEngineer) queryParams.push(`itEngineerId=${itEngineer.value}`);
      if (status !== 'both') queryParams.push(`status=${status}`);
      if (reportType === 'monthly') {
        queryParams.push(`month=${month.value}`, `year=${year.value}`);
      } else if (reportType === 'custom') {
        if (startDate) queryParams.push(`startDate=${startDate}`);
        if (endDate) queryParams.push(`endDate=${endDate}`);
      }
      const query = queryParams.length ? `&${queryParams.join("&")}` : "";


      setIsDownloading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://${apiIp}/tickets/excel/download?dummy=dummy${query}`, {
        headers: {
          'authorization': `Bearer ${token}`,
          'accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        },
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `ticket_report_${Date.now()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
      resetForm();
      onClose();
      toast({
        title: "success",
        description: "Excel Downloaded Successfully.",
        isClosable: true,
        duration: 3000
      });
    } catch (error) {
      toast({
        title: "error",
        description: "Excel Downloaded Failed.",
        isClosable: true,
        duration: 3000
      });
      console.error('Download failed:', error.message);
    } finally {
      setIsDownloading(false);
    }
  };

  const resetForm = () => {
    setItEngineer();
    setStatus('both');
    setStartDate();
    setEndDate();
  }

  useEffect(() => {
    const fetchItEngineers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://${apiIp}/user/it-users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const itEngineersOptions = response.data?.map((engineer) => ({ label: engineer.label, value: engineer.id }));
        setItEngineers(itEngineersOptions);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch It Engineers.",
          duration: "3000",
          status: "error",
        });
      }
    };
    fetchItEngineers();
  }, [])

  return (
    <>
      <Tooltip label="Download Excel">
      <IconButton
        icon={<Download size={18} />}
        colorScheme="gray"
        variant={'outline'}
        aria-label="Download Excel Report"
        onClick={onOpen}
        size="sm"
      />
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader backgroundColor="#edf2f7">Download Excel Report</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mb={4} pb={2} borderBottom={'2px solid gray'}>
              <RadioGroup value={reportType} onChange={setReportType}>
                <Stack justifyContent={{ base: "left", md: "space-between" }} direction={{ base: "column", md: "row" }}>
                  <Radio border={'1px solid gray'} value="whole" >Whole Data</Radio>
                  <Radio value="monthly">Monthly</Radio>
                  <Radio value="custom">Custom</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            {reportType === 'monthly' && (
              <>
                <FormControl mb={4}>
                  <FormLabel>Month</FormLabel>
                  <Select
                    placeholder="Select month"
                    value={month}
                    onChange={(selectedOption) => setMonth(selectedOption)}
                    options={months}
                  >
                  </Select>
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Year</FormLabel>
                  <Select
                    value={year}
                    onChange={(selectedOption) => setYear(selectedOption)}
                    options={years}
                  >
                  </Select>
                </FormControl>
              </>
            )}

            {reportType === 'custom' && (
              <>
                <FormControl mb={4} isRequired>
                  <FormLabel>Start Date</FormLabel>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>End Date (Optional)</FormLabel>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </FormControl>
              </>
            )}

            <FormControl mb={4}>
              <FormLabel>Engineer ID (Optional)</FormLabel>
              <Select
                placeholder="Select IT Engineer"
                options={itEngineers}
                value={itEngineer}
                onChange={(selectedOption) => setItEngineer(selectedOption)}
                isClearable
              />
            </FormControl>

            <FormControl>
              <FormLabel>Status</FormLabel>
              <RadioGroup value={status} onChange={setStatus}>
                <Stack direction="row">
                  <Radio value="open">Open</Radio>
                  <Radio value="close">Close</Radio>
                  <Radio value="both">Both</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} isLoading={isDownLoading} onClick={handleDownload}>
              Download
            </Button>
            <Button variant={'outline'} onClick={() => { onClose(); resetForm(); }}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ExcelReportDownloadButton;